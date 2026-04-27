import pandas as pd


def evaluate_schedulers(
    baseline_df,
    smart_df,
    threshold,
    batch_df=None
):
    baseline_total_irrigation = baseline_df["irrigation_amount"].sum()
    smart_total_irrigation = smart_df["smart_irrigation"].sum()

    baseline_stress_days = (baseline_df["soil_moisture"] < threshold).sum()
    smart_stress_days = (smart_df["adjusted_moisture"] < threshold).sum()

    baseline_irrigated_days = (baseline_df["irrigation_amount"] > 0).sum()
    smart_irrigated_days = (smart_df["smart_irrigation"] > 0).sum()

    rows = [
        {
            "scheduler": "Baseline",
            "total_irrigation": round(baseline_total_irrigation, 4),
            "stress_days": int(baseline_stress_days),
            "irrigated_days": int(baseline_irrigated_days),
            "water_saved_vs_baseline": 0.0,
            "water_saving_percent": 0.0
        },
        {
            "scheduler": "Smart SAR + Uncertainty",
            "total_irrigation": round(smart_total_irrigation, 4),
            "stress_days": int(smart_stress_days),
            "irrigated_days": int(smart_irrigated_days),
            "water_saved_vs_baseline": round(baseline_total_irrigation - smart_total_irrigation, 4),
            "water_saving_percent": round(
                ((baseline_total_irrigation - smart_total_irrigation) / baseline_total_irrigation) * 100,
                2
            )
        }
    ]

    if batch_df is not None:
        batch_total_irrigation = batch_df["batch_irrigation"].sum()
        batch_irrigated_days = (batch_df["batch_irrigation"] > 0).sum()

        # Stress days remain same as smart scheduler because batching is a practical
        # post-processing of the smart schedule, not a separate soil simulation.
        batch_stress_days = smart_stress_days

        rows.append({
            "scheduler": "Batch Smart Scheduler",
            "total_irrigation": round(batch_total_irrigation, 4),
            "stress_days": int(batch_stress_days),
            "irrigated_days": int(batch_irrigated_days),
            "water_saved_vs_baseline": round(baseline_total_irrigation - batch_total_irrigation, 4),
            "water_saving_percent": round(
                ((baseline_total_irrigation - batch_total_irrigation) / baseline_total_irrigation) * 100,
                2
            )
        })

    return pd.DataFrame(rows)