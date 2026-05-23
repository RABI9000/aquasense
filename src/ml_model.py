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


def run_model_comparison(df):
    from sklearn.ensemble import GradientBoostingRegressor
    import numpy as np
    from sklearn.metrics import mean_absolute_error
    import time

    # TensorFlow is heavy and optional; LSTM row is skipped if it can't be imported.
    try:
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import LSTM, Dense, Input
        from tensorflow.keras.optimizers import Adam
        _HAS_TF = True
    except Exception:
        _HAS_TF = False
    
    ml_df = create_ml_dataset(df)
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
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )
    
    results = []

    # 1. Random Forest
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    start_time = time.time()
    rf_model.fit(X_train.to_numpy(), y_train)
    rf_preds = rf_model.predict(X_test.to_numpy())
    rf_time = (time.time() - start_time) * 1000 # ms
    rf_rmse = mean_squared_error(y_test, rf_preds) ** 0.5
    rf_mae = mean_absolute_error(y_test, rf_preds)
    results.append({"Model": "Random Forest", "RMSE": rf_rmse, "MAE": rf_mae, "Inference Time (ms)": rf_time})

    # 2. Gradient Boosting (Alternative to XGBoost, native to Scikit-Learn)
    gb_model = GradientBoostingRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42)
    start_time = time.time()
    gb_model.fit(X_train.to_numpy(), y_train)
    gb_preds = gb_model.predict(X_test.to_numpy())
    gb_time = (time.time() - start_time) * 1000
    gb_rmse = mean_squared_error(y_test, gb_preds) ** 0.5
    gb_mae = mean_absolute_error(y_test, gb_preds)
    results.append({"Model": "Gradient Boosting", "RMSE": gb_rmse, "MAE": gb_mae, "Inference Time (ms)": gb_time})

    # 3. LSTM (optional — requires TensorFlow)
    if _HAS_TF:
        try:
            X_train_lstm = np.reshape(X_train.to_numpy(), (X_train.shape[0], 1, X_train.shape[1]))
            X_test_lstm = np.reshape(X_test.to_numpy(), (X_test.shape[0], 1, X_test.shape[1]))

            lstm_model = Sequential()
            lstm_model.add(Input(shape=(X_train_lstm.shape[1], X_train_lstm.shape[2])))
            lstm_model.add(LSTM(50, activation='relu'))
            lstm_model.add(Dense(1))
            lstm_model.compile(optimizer=Adam(learning_rate=0.01), loss='mse')

            lstm_model.fit(X_train_lstm, y_train, epochs=20, batch_size=32, verbose=0)

            start_time = time.time()
            lstm_preds = lstm_model.predict(X_test_lstm, verbose=0).flatten()
            lstm_time = (time.time() - start_time) * 1000
            lstm_rmse = mean_squared_error(y_test, lstm_preds) ** 0.5
            lstm_mae = mean_absolute_error(y_test, lstm_preds)
            results.append({"Model": "LSTM", "RMSE": lstm_rmse, "MAE": lstm_mae, "Inference Time (ms)": lstm_time})
        except Exception as e:
            print(f"[ml_model] LSTM comparison skipped: {e}")

    return pd.DataFrame(results)