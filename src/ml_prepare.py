import pandas as pd
import os

df = pd.read_csv("data/clean/final_dataset.csv")
df["date"] = pd.to_datetime(df["date"])

# Create lag features for previous 7 days
for lag in range(1, 8):
    df[f"soil_moisture_lag_{lag}"] = df["soil_moisture"].shift(lag)
    df[f"rainfall_lag_{lag}"] = df["rainfall"].shift(lag)
    df[f"temperature_lag_{lag}"] = df["temperature"].shift(lag)

# Predict next day's soil moisture
df["target_soil_moisture_next_day"] = df["soil_moisture"].shift(-1)

# Drop rows with NaNs from shifting
df = df.dropna().reset_index(drop=True)

os.makedirs("data/clean", exist_ok=True)
df.to_csv("data/clean/ml_dataset.csv", index=False)

print("✅ ML dataset created")
print(df.head())
print(df.columns.tolist())