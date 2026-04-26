import pandas as pd


def run_baseline_scheduler(
    df: pd.DataFrame,
    threshold: float,
    target: float,
    max_irrigation: float = 0.05
) -> pd.DataFrame:
    """
    Baseline irrigation scheduler using observed soil moisture.

    Logic:
    - If soil_moisture < threshold, irrigate toward target
    - Irrigation amount = min(target - soil_moisture, max_irrigation)
    - Else, no irrigation

    Parameters
    ----------
    df : pd.DataFrame
        Must contain columns:
        ['date', 'rainfall', 'soil_moisture', 'temperature']
    threshold : float
        Soil moisture threshold below which irrigation starts
    target : float
        Desired moisture target after irrigation
    max_irrigation : float
        Maximum irrigation allowed in one day

    Returns
    -------
    pd.DataFrame
        Original dataframe +:
        - needs_irrigation
        - irrigation_amount
        - projected_moisture
    """
    out = df.copy()

    irrigation_amounts = []
    needs_irrigation = []
    projected_moisture = []

    for sm in out["soil_moisture"]:
        if sm < threshold:
            irrigation = max(0.0, min(target - sm, max_irrigation))
            needs_irrigation.append(1)
        else:
            irrigation = 0.0
            needs_irrigation.append(0)

        irrigation_amounts.append(irrigation)
        projected_moisture.append(sm + irrigation)

    out["needs_irrigation"] = needs_irrigation
    out["irrigation_amount"] = irrigation_amounts
    out["projected_moisture"] = projected_moisture

    return out