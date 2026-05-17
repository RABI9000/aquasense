import pandas as pd


def load_crop_dataset(path="data/clean/crop_dataset.csv"):
    return pd.read_csv(path)


def get_crop_settings(crop_df, crop_name, stage):
    crop_name = crop_name.strip().lower()
    stage = stage.strip().lower()

    if crop_name not in crop_df["crop_name"].values:
        raise ValueError(f"Crop '{crop_name}' not found in dataset.")

    if stage not in ["initial", "mid", "end"]:
        raise ValueError(f"Invalid stage '{stage}'. Must be initial, mid, or end.")

    row = crop_df[crop_df["crop_name"] == crop_name].iloc[0]

    if stage == "initial":
        kc = row["kc_initial"]
    elif stage == "mid":
        kc = row["kc_mid"]
    else:
        kc = row["kc_end"]

    return {
        "crop_name": crop_name,
        "stage": stage,
        "kc": float(kc),
        "root_depth_m": float(row["root_depth_m"])
    }