import pandas as pd


def get_soil_moisture_on_date(df, target_date):
    row = df[df["date"] == target_date]
    if row.empty:
        raise ValueError(f"No row found for date {target_date}")
    return float(row["soil_moisture"].iloc[0])


def build_single_scene_sar_proxy_moisture(df, sar_date, sar_proxy):
    """
    Map SAR proxy to soil moisture scale using a simple proxy-range normalization.

    Since only one SAR scene is available, we assume a rough SAR proxy range
    around the observed value. This is only for demonstration of the correction
    mechanism and should later be replaced by multi-date SAR calibration.
    """
    sm_min = float(df["soil_moisture"].min())
    sm_max = float(df["soil_moisture"].max())

    # Temporary assumed SAR proxy range around current observed proxy
    proxy_min = sar_proxy - 50.0
    proxy_max = sar_proxy + 50.0

    if proxy_max == proxy_min:
        normalized = 0.5
    else:
        normalized = (sar_proxy - proxy_min) / (proxy_max - proxy_min)

    normalized = max(0.0, min(1.0, normalized))

    sar_proxy_moisture = sm_min + normalized * (sm_max - sm_min)

    return {
        "sar_proxy": sar_proxy,
        "normalized_proxy": normalized,
        "sar_proxy_moisture": sar_proxy_moisture
    }


def apply_sar_correction(predicted_moisture, sar_proxy_moisture, model_weight=0.7, sar_weight=0.3):
    corrected = model_weight * predicted_moisture + sar_weight * sar_proxy_moisture
    return corrected