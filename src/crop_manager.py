import pandas as pd


def load_crop_dataset(path="data/clean/crop_dataset.csv"):
    return pd.read_csv(path)


def get_crop_settings(crop_df):
    available_crops = crop_df["crop_name"].tolist()

    while True:
        crop_name = input("Enter crop name: ").strip().lower()

        if crop_name in available_crops:
            break

        print("Crop not found. Available examples:")
        print(", ".join(available_crops[:15]))

    while True:
        stage = input("Enter crop stage (initial/mid/end): ").strip().lower()

        if stage in ["initial", "mid", "end"]:
            break

        print("Please enter initial, mid, or end.")

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