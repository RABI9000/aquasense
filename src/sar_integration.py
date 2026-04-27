import pandas as pd


def merge_calibrated_sar_with_dataset(main_df, sar_calibrated_df):
    main_df = main_df.copy()
    sar_calibrated_df = sar_calibrated_df.copy()

    main_df["date"] = pd.to_datetime(main_df["date"])
    sar_calibrated_df["date"] = pd.to_datetime(sar_calibrated_df["date"])

    sar_subset = sar_calibrated_df[
        ["date", "sar_proxy", "sar_calibrated_moisture"]
    ]

    merged = pd.merge(main_df, sar_subset, on="date", how="left")

    return merged


def apply_sar_correction(df, alpha=0.3):
    """
    Blend observed/NASA soil moisture with calibrated SAR moisture.

    alpha = SAR trust weight
    alpha = 0.3 means:
    70% original soil moisture + 30% SAR-calibrated moisture
    """
    df = df.copy()

    df["sar_corrected_moisture"] = df["soil_moisture"]

    mask = df["sar_calibrated_moisture"].notna()

    df.loc[mask, "sar_corrected_moisture"] = (
        (1 - alpha) * df.loc[mask, "soil_moisture"]
        + alpha * df.loc[mask, "sar_calibrated_moisture"]
    )

    return df