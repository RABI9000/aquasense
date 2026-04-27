import os

import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score


def calibrate_sar_to_soil_moisture(
    main_dataset_path="data/clean/final_dataset.csv",
    sar_timeseries_path="data/clean/sar_timeseries.csv",
    output_path="data/clean/sar_calibrated.csv"
):
    # Load datasets
    main_df = pd.read_csv(main_dataset_path)
    sar_df = pd.read_csv(sar_timeseries_path)

    main_df["date"] = pd.to_datetime(main_df["date"])
    sar_df["date"] = pd.to_datetime(sar_df["date"])

    # Merge SAR values with actual soil moisture on matching SAR dates
    merged = pd.merge(
        sar_df,
        main_df[["date", "soil_moisture"]],
        on="date",
        how="inner"
    )

    if merged.empty:
        raise ValueError("No matching dates found between SAR and main dataset.")

    # Features and target
    X = merged[["sar_proxy"]]
    y = merged["soil_moisture"]

    # Train simple calibration model
    model = LinearRegression()
    model.fit(X, y)

    # Predict calibrated moisture
    merged["sar_calibrated_moisture"] = model.predict(X)

    # Metrics
    mse = mean_squared_error(y, merged["sar_calibrated_moisture"])
    rmse = mse ** 0.5

    # R2 can be unstable with very small datasets, but still useful to print
    r2 = r2_score(y, merged["sar_calibrated_moisture"])

    print("\n=== SAR CALIBRATION SUMMARY ===")
    print(f"Number of SAR points used: {len(merged)}")
    print(f"Model: Linear Regression")
    print(f"Equation: soil_moisture = {model.coef_[0]:.6f} * sar_proxy + {model.intercept_:.6f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R2 Score: {r2:.4f}")

    print("\n=== SAR CALIBRATED DATA ===")
    print(
        merged[
            ["date", "sar_proxy", "soil_moisture", "sar_calibrated_moisture"]
        ].to_string(index=False)
    )

    # Save output
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    merged.to_csv(output_path, index=False)

    print(f"\n✅ Calibrated SAR data saved to: {output_path}")

    return merged, model


if __name__ == "__main__":
    calibrate_sar_to_soil_moisture()