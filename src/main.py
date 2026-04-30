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
from crop_manager import load_crop_dataset, get_crop_settings   # ✅ NEW

from sar_integration import (
    merge_calibrated_sar_with_dataset,
    apply_sar_correction
)


def get_farm_area():
    while True:
        user_input = input("Enter farm size (just number, e.g., 1): ").strip()

        try:
            area = float(user_input)
            if area <= 0:
                print("Enter a value > 0")
                continue
            break
        except:
            print("Invalid input. Enter only a number (e.g., 1)")

    while True:
        unit = input("Enter unit (acres/hectares): ").strip().lower()

        if unit in ["acres", "acre"]:
            return area, "acres"
        elif unit in ["hectares", "hectare", "ha"]:
            return area, "hectares"
        else:
            print("Enter 'acres' or 'hectares'")

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

    # -----------------------------
    # Load data
    # -----------------------------
    df = pd.read_csv("data/clean/final_dataset.csv")
    df["date"] = pd.to_datetime(df["date"])

    sar_df = pd.read_csv("data/clean/sar_calibrated.csv")
    df = merge_calibrated_sar_with_dataset(df, sar_df)
    df = apply_sar_correction(df, alpha=0.3)

    # -----------------------------
    # Soil
    # -----------------------------
    soil = json.load(open("data/clean/soil_properties.json"))
    fc, wp, aw = soil["fc"], soil["wp"], soil["available_water"]

    print("\n=== SOIL ===")
    print(f"FC={fc:.3f}, WP={wp:.3f}, AW={aw:.3f}")

    threshold = df["soil_moisture"].quantile(0.25)
    target = df["soil_moisture"].quantile(0.60)

    print("\n=== THRESHOLDS ===")
    print(f"Threshold={threshold:.3f}, Target={target:.3f}")

    # -----------------------------
    # Crop selection (NEW)
    # -----------------------------
    crop_df = load_crop_dataset()
    crop = get_crop_settings(crop_df)

    print("\n=== CROP SETTINGS ===")
    print(f"Crop: {crop['crop_name']}")
    print(f"Stage: {crop['stage']}")
    print(f"Kc: {crop['kc']}")
    print(f"Root Depth: {crop['root_depth_m']} m")

    crop_kc = crop["kc"]

    # -----------------------------
    # Inputs
    # -----------------------------
    area, unit = get_farm_area()
    forecast = get_future_weather_forecast()

    # -----------------------------
    # Baseline
    # -----------------------------
    baseline_df = run_baseline_scheduler(df, threshold, target)

    # -----------------------------
    # ML
    # -----------------------------
    model, features, rmse = train_model(df)

    # -----------------------------
    # Smart (UPDATED)
    # -----------------------------
    smart_df = run_smart_scheduler(
        df,
        model,
        features,
        threshold,
        target,
        crop_kc=crop_kc   # ✅ NEW
    )

    # -----------------------------
    # Batch
    # -----------------------------
    batch_df = create_batch_irrigation_schedule(smart_df)

    # -----------------------------
    # Evaluation
    # -----------------------------
    comparison = evaluate_schedulers(
        baseline_df, smart_df, threshold, batch_df
    )

    # -----------------------------
    # Future schedule (UPDATED)
    # -----------------------------
    schedule = generate_future_schedule(
        df,
        model,
        features,
        threshold,
        target,
        crop_kc=crop_kc,   # ✅ NEW
        area_value=area,
        area_unit=unit,
        future_forecast=forecast
    )

    # -----------------------------
    # Prints
    # -----------------------------
    print("\n=== FINAL RESULTS ===")
    print(comparison.to_string(index=False))

    print("\n=== NEXT 5-DAY SCHEDULE ===")
    print(schedule.to_string(index=False))

    print("\n=== BATCH SUMMARY ===")
    print(f"Total={batch_df['batch_irrigation'].sum():.4f}")
    print(f"Days={(batch_df['batch_irrigation']>0).sum()}")
   # print(batch_df[["date", "batch_irrigation"]])
    print(batch_df[batch_df["batch_irrigation"] > 0])

    # -----------------------------
    # Save CSV
    # -----------------------------
    baseline_df.to_csv("results/baseline.csv", index=False)
    smart_df.to_csv("results/smart.csv", index=False)
    batch_df.to_csv("results/batch.csv", index=False)
    schedule.to_csv("results/future.csv", index=False)
    comparison.to_csv("results/comparison.csv", index=False)

    # -----------------------------
    # Summary file
    # -----------------------------
    with open("results/project_summary.txt", "w") as f:
        f.write("SMART IRRIGATION SYSTEM\n\n")

        f.write("Crop:\n")
        f.write(f"{crop['crop_name']} ({crop['stage']})\n")
        f.write(f"Kc: {crop['kc']}\n\n")

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