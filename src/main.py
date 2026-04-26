import json
import os
import matplotlib.pyplot as plt
import pandas as pd

from baseline_scheduler import run_baseline_scheduler
from ml_model import train_model
from smart_scheduler import run_smart_scheduler
from schedule_generator import generate_future_schedule
from sar_processor import extract_mean_backscatter, compute_sar_proxy
from sar_correction import build_single_scene_sar_proxy_moisture, apply_sar_correction


def get_farm_area():
    while True:
        try:
            area = float(input("Enter farm size: "))
            if area <= 0:
                print("Farm size must be greater than 0.")
                continue
            break
        except ValueError:
            print("Please enter a valid numeric value.")

    while True:
        unit = input("Enter unit (acres/hectares): ").strip().lower()
        if unit in ["acres", "acre"]:
            unit = "acres"
            break
        elif unit in ["hectares", "hectare", "ha"]:
            unit = "hectares"
            break
        else:
            print("Please enter either 'acres' or 'hectares'.")

    return area, unit


def main():
    df = pd.read_csv("data/clean/final_dataset.csv")
    df["date"] = pd.to_datetime(df["date"])

    with open("data/clean/soil_properties.json", "r") as f:
        soil = json.load(f)

    fc = soil["fc"]
    wp = soil["wp"]
    available_water = soil["available_water"]

    threshold = df["soil_moisture"].quantile(0.25)
    target = df["soil_moisture"].quantile(0.60)

    area_value, area_unit = get_farm_area()

    # BASELINE
    baseline_df = run_baseline_scheduler(df, threshold, target)
    baseline_stress = (baseline_df["soil_moisture"] < threshold).sum()
    baseline_total = baseline_df["irrigation_amount"].sum()

    # ML MODEL
    model, feature_columns = train_model()

    # SMART
    smart_df = run_smart_scheduler(
        df,
        model,
        feature_columns,
        threshold,
        target
    )

    smart_total = smart_df["smart_irrigation"].sum()
    smart_stress = (smart_df["adjusted_moisture"] < threshold).sum()

    # FUTURE SCHEDULE
    schedule_df = generate_future_schedule(
        df=df,
        model=model,
        feature_columns=feature_columns,
        threshold=threshold,
        target=target,
        area_value=area_value,
        area_unit=area_unit,
        days_ahead=5
    )

    print("\n=== FINAL COMPARISON ===")
    print(f"Baseline Irrigation: {baseline_total:.4f}")
    print(f"Smart Irrigation: {smart_total:.4f}")
    print(f"Baseline Stress Days: {baseline_stress}")
    print(f"Smart Stress Days: {smart_stress}")

    print(f"\n=== NEXT 5-DAY IRRIGATION SCHEDULE ({area_value} {area_unit}) ===")
    print(schedule_df.to_string(index=False))

    os.makedirs("results", exist_ok=True)
    baseline_df.to_csv("results/baseline.csv", index=False)
    smart_df.to_csv("results/smart.csv", index=False)
    schedule_df.to_csv("results/future_schedule.csv", index=False)

    # vv_path = "data/raw/s1a-iw-grd-vv-20231227t005504-20231227t005529-051833-0642ef-001.tiff"
    # vh_path = "data/raw/s1a-iw-grd-vh-20231227t005504-20231227t005529-051833-0642ef-002.tiff"

    # vv_mean = extract_mean_backscatter(vv_path)
    # vh_mean = extract_mean_backscatter(vh_path)
    # sar_proxy = compute_sar_proxy(vv_mean, vh_mean)

    # print("\n=== SAR VALUES ===")
    # print(f"VV Mean: {vv_mean}")
    # print(f"VH Mean: {vh_mean}")  
    # print(f"SAR Proxy: {sar_proxy:.4f}")
    
        # -----------------------------
    # SAR single-scene integration
    # -----------------------------
    vv_path = "data/raw/s1a-iw-grd-vv-20231227t005504-20231227t005529-051833-0642ef-001.tiff"
    vh_path = "data/raw/s1a-iw-grd-vh-20231227t005504-20231227t005529-051833-0642ef-002.tiff"

    vv_mean = extract_mean_backscatter(vv_path)
    vh_mean = extract_mean_backscatter(vh_path)
    sar_proxy = compute_sar_proxy(vv_mean, vh_mean)

    sar_date = pd.Timestamp("2023-12-27")

    sar_info = build_single_scene_sar_proxy_moisture(
        df=df,
        sar_date=sar_date,
        sar_proxy=sar_proxy
    )

    observed_sm_on_sar_date = float(df.loc[df["date"] == sar_date, "soil_moisture"].iloc[0])

    corrected_sm = apply_sar_correction(
        predicted_moisture=observed_sm_on_sar_date,
        sar_proxy_moisture=sar_info["sar_proxy_moisture"],
        model_weight=0.7,
        sar_weight=0.3
    )

    print("\n=== SAR SINGLE-SCENE SUMMARY ===")
    print(f"SAR Date: {sar_date.date()}")
    print(f"VV Mean: {vv_mean:.4f}")
    print(f"VH Mean: {vh_mean:.4f}")
    print(f"SAR Proxy: {sar_proxy:.4f}")
    print(f"Normalized SAR Proxy: {sar_info['normalized_proxy']:.4f}")
    print(f"Observed Soil Moisture on SAR Date: {observed_sm_on_sar_date:.4f}")
    print(f"SAR Proxy Moisture Estimate: {sar_info['sar_proxy_moisture']:.4f}")
    print(f"SAR-Corrected Moisture: {corrected_sm:.4f}")
    
     
    # Plot 1: observed vs predicted
    plt.figure(figsize=(12, 5))
    plt.plot(df["date"], df["soil_moisture"], label="Observed")
    plt.plot(df["date"], smart_df["predicted_moisture"], label="Predicted")
    plt.axhline(threshold, linestyle="--", label="Threshold")
    plt.legend()
    plt.tight_layout()
    plt.show()

    # Plot 2: baseline irrigation
    plt.figure(figsize=(12, 4))
    plt.bar(baseline_df["date"], baseline_df["irrigation_amount"])
    plt.title("Baseline Irrigation Schedule")
    plt.xlabel("Date")
    plt.ylabel("Irrigation Amount")
    plt.tight_layout()
    plt.show()

    # Plot 3: smart irrigation
    plt.figure(figsize=(12, 4))
    plt.bar(smart_df["date"], smart_df["smart_irrigation"])
    plt.title("Smart Irrigation Schedule")
    plt.xlabel("Date")
    plt.ylabel("Irrigation Amount")
    plt.tight_layout()
    plt.show()

    # Plot 4: rainfall
    plt.figure(figsize=(12, 4))
    plt.bar(df["date"], df["rainfall"])
    plt.title("Daily Rainfall")
    plt.xlabel("Date")
    plt.ylabel("Rainfall")
    plt.tight_layout()
    plt.show()

    # Plot 5: temperature
    plt.figure(figsize=(12, 4))
    plt.plot(df["date"], df["temperature"])
    plt.title("Daily Temperature")
    plt.xlabel("Date")
    plt.ylabel("Temperature")
    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()