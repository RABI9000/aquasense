import os
import pandas as pd

# -----------------------------
# Input / Output file paths
# -----------------------------
input_file = "clean/clean_nasa.csv"                  # change this if needed
output_file = "clean/final_dataset.csv"

# -----------------------------
# Read file
# -----------------------------
df = pd.read_csv(input_file)

# -----------------------------
# Keep only required columns
# -----------------------------
df = df[["date", "rainfall", "soil_moisture", "temperature"]]

# -----------------------------
# Handle missing/error values
# -----------------------------
df = df.replace(-999, pd.NA)
df = df.ffill()

# -----------------------------
# Convert soil moisture back to fraction
# (because it was earlier scaled by * 60)
# Only do this if values are clearly above 1
# -----------------------------
if df["soil_moisture"].max() > 1:
    df["soil_moisture"] = df["soil_moisture"] / 60

# -----------------------------
# Ensure correct data types
# -----------------------------
df["date"] = pd.to_datetime(df["date"])
df["rainfall"] = df["rainfall"].astype(float)
df["soil_moisture"] = df["soil_moisture"].astype(float)
df["temperature"] = df["temperature"].astype(float)

# -----------------------------
# Sort, drop duplicate dates, reset index
# -----------------------------
df = df.sort_values("date")
df = df.drop_duplicates(subset="date")
df = df.reset_index(drop=True)

# -----------------------------
# Rounding off
# -----------------------------
df["soil_moisture"] = df["soil_moisture"].round(3)
df["rainfall"] = df["rainfall"].round(2)
df["temperature"] = df["temperature"].round(2)

# -----------------------------
# Save cleaned file
# -----------------------------
os.makedirs("clean", exist_ok=True)
df.to_csv(output_file, index=False)

print("✅ Cleaned dataset saved to:", output_file)
print(df.head())
print(df.info())
print(df.describe())

# ------------------------
# Safety Checks
# ------------------------
print(df.isna().sum())
print(df.duplicated(subset="date").sum())
print(df["date"].min(), df["date"].max(), len(df))