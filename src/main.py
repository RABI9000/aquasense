import json
import os

import matplotlib.pyplot as plt
import pandas as pd

from baseline_scheduler import run_baseline_scheduler
from ml_model import train_model
from smart_scheduler import run_smart_scheduler
from schedule_generator import generate_future_schedule
from weather_api import get_weather_forecast
from evaluation import evaluate_schedulers
from batch_scheduler import create_batch_irrigation_schedule

from sar_integration import (
    merge_calibrated_sar_with_dataset,
    apply_sar_correction
)


def get_farm_area():
    while True:
        try:
            area = float(input("Enter farm size: "))
            if area <= 0:
                continue
            break
        except:
            continue

    unit = input("Enter unit (acres/hectares): ").strip().lower()
    if unit in ["hectares", "ha"]:
        return area, "hectares"
    return area, "acres"


def get_future_weather_forecast(days_ahead=5):
    use_api = input("Use weather API? (yes/no): ").lower()

    if use_api in ["yes", "y"]:
        lat = float(input("Enter latitude: "))
        lon = float(input("Enter longitude: "))

        forecast = get_weather_forecast(lat, lon, days_ahead)

        print("\n=== WEATHER FORECAST ===")
        for i, d in enumerate(forecast, 1):
            print(f"Day {i}: Rain={d['rainfall']} Temp={d['temperature']}")

        return forecast

    return None


def main():
    os.makedirs("results/plots", exist_ok=True)

    # Load data
    df = pd.read_csv("data/clean/final_dataset.csv")
    df["date"] = pd.to_datetime(df["date"])

    sar_df = pd.read_csv("data/clean/sar_calibrated.csv")
    df = merge_calibrated_sar_with_dataset(df, sar_df)
    df = apply_sar_correction(df, alpha=0.3)

    # Soil
    soil = json.load(open("data/clean/soil_properties.json"))
    fc, wp, aw = soil["fc"], soil["wp"], soil["available_water"]

    print("\n=== SOIL ===")
    print(f"FC={fc:.3f}, WP={wp:.3f}, AW={aw:.3f}")

    threshold = df["soil_moisture"].quantile(0.25)
    target = df["soil_moisture"].quantile(0.60)

    print("\n=== THRESHOLDS ===")
    print(f"Threshold={threshold:.3f}, Target={target:.3f}")

    area, unit = get_farm_area()
    forecast = get_future_weather_forecast()

    # Baseline
    baseline_df = run_baseline_scheduler(df, threshold, target)

    # ML
    model, features, rmse = train_model(df)

    # Smart
    smart_df = run_smart_scheduler(df, model, features, threshold, target)

    # Batch
    batch_df = create_batch_irrigation_schedule(smart_df)

    # Evaluation
    comparison = evaluate_schedulers(
        baseline_df, smart_df, threshold, batch_df
    )

    # Future schedule
    schedule = generate_future_schedule(
        df, model, features, threshold, target,
        area_value=area, area_unit=unit,
        future_forecast=forecast
    )

    # Summary prints
    print("\n=== FINAL RESULTS ===")
    print(comparison.to_string(index=False))

    print("\n=== NEXT 5-DAY SCHEDULE ===")
    print(schedule.to_string(index=False))

    print("\n=== BATCH SUMMARY ===")
    print(f"Total={batch_df['batch_irrigation'].sum():.4f}")
    print(f"Days={(batch_df['batch_irrigation']>0).sum()}")

    # Save CSV
    baseline_df.to_csv("results/baseline.csv", index=False)
    smart_df.to_csv("results/smart.csv", index=False)
    batch_df.to_csv("results/batch.csv", index=False)
    schedule.to_csv("results/future.csv", index=False)
    comparison.to_csv("results/comparison.csv", index=False)

    # -------- PLOTS --------

    # Moisture
    plt.figure()
    plt.plot(df["date"], df["soil_moisture"])
    plt.plot(df["date"], smart_df["predicted_moisture"])
    plt.title("Moisture")
    plt.savefig("results/plots/moisture.png")
    plt.close()

    # Baseline
    plt.figure()
    plt.bar(df["date"], baseline_df["irrigation_amount"])
    plt.title("Baseline")
    plt.savefig("results/plots/baseline.png")
    plt.close()

    # Smart
    plt.figure()
    plt.bar(df["date"], smart_df["smart_irrigation"])
    plt.title("Smart")
    plt.savefig("results/plots/smart.png")
    plt.close()

    # Batch
    plt.figure()
    plt.bar(df["date"], batch_df["batch_irrigation"])
    plt.title("Batch")
    plt.savefig("results/plots/batch.png")
    plt.close()

    # Comparison
    plt.figure()
    plt.bar(comparison["scheduler"], comparison["total_irrigation"])
    plt.title("Comparison")
    plt.savefig("results/plots/comparison.png")
    plt.close()

    # -------- SUMMARY FILE --------

    with open("results/project_summary.txt", "w") as f:
        f.write("SMART IRRIGATION SYSTEM\n\n")
        f.write(f"RMSE: {rmse:.4f}\n\n")

        f.write("Comparison:\n")
        f.write(comparison.to_string(index=False))
        f.write("\n\nBatch:\n")
        f.write(f"Total: {batch_df['batch_irrigation'].sum():.4f}\n")
        f.write(f"Days: {(batch_df['batch_irrigation']>0).sum()}\n\n")

        f.write("Next 5 Days:\n")
        f.write(schedule.to_string(index=False))


if __name__ == "__main__":
    main()