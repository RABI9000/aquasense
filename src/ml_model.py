import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error


def train_model():
    df = pd.read_csv("data/clean/ml_dataset.csv")

    df = df.drop(columns=["date"])

    X = df.drop(columns=["target_soil_moisture_next_day"])
    y = df["target_soil_moisture_next_day"]

    feature_columns = X.columns.tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    # Convert to numpy so training and prediction are consistent
    X_train_np = X_train.to_numpy()
    X_test_np = X_test.to_numpy()

    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=6,
        random_state=42
    )

    model.fit(X_train_np, y_train)

    preds = model.predict(X_test_np)

    mse = mean_squared_error(y_test, preds)
    rmse = mse ** 0.5

    print("\n=== ML MODEL PERFORMANCE ===")
    print(f"RMSE: {rmse:.4f}")

    return model, feature_columns