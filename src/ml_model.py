import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error


def create_ml_dataset(df, moisture_col="sar_corrected_moisture", window=7):
    data = df.copy()

    # Fallback if SAR-corrected column is not available
    if moisture_col not in data.columns:
        moisture_col = "soil_moisture"

    for lag in range(1, window + 1):
        data[f"soil_moisture_lag_{lag}"] = data[moisture_col].shift(lag)
        data[f"rainfall_lag_{lag}"] = data["rainfall"].shift(lag)
        data[f"temperature_lag_{lag}"] = data["temperature"].shift(lag)

    data["target_soil_moisture_next_day"] = data[moisture_col].shift(-1)

    data = data.dropna().reset_index(drop=True)

    return data


def train_model(df):
    ml_df = create_ml_dataset(df)

    feature_columns = [
        "rainfall",
        "soil_moisture",
        "temperature"
    ]

    for lag in range(1, 8):
        feature_columns.extend([
            f"soil_moisture_lag_{lag}",
            f"rainfall_lag_{lag}",
            f"temperature_lag_{lag}"
        ])

    # Use SAR-corrected moisture as current moisture input when available
    moisture_col = "sar_corrected_moisture" if "sar_corrected_moisture" in ml_df.columns else "soil_moisture"

    X = pd.DataFrame()
    X["rainfall"] = ml_df["rainfall"]
    X["soil_moisture"] = ml_df[moisture_col]
    X["temperature"] = ml_df["temperature"]

    for lag in range(1, 8):
        X[f"soil_moisture_lag_{lag}"] = ml_df[f"soil_moisture_lag_{lag}"]
        X[f"rainfall_lag_{lag}"] = ml_df[f"rainfall_lag_{lag}"]
        X[f"temperature_lag_{lag}"] = ml_df[f"temperature_lag_{lag}"]

    y = ml_df["target_soil_moisture_next_day"]

    feature_columns = X.columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=6,
        random_state=42
    )

    model.fit(X_train.to_numpy(), y_train)

    preds = model.predict(X_test.to_numpy())

    mse = mean_squared_error(y_test, preds)
    rmse = mse ** 0.5

    print("\n=== ML MODEL PERFORMANCE ===")
    print(f"RMSE: {rmse:.4f}")

    return model, feature_columns, rmse