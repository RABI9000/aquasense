import pandas as pd


def run_smart_scheduler(
    df,
    model,
    feature_columns,
    threshold,
    target,
    max_irrigation=0.05,
    safety_margin=0.015,
    irrigation_efficiency=0.65
):
    """
    Smart irrigation scheduler using ML-predicted next-day soil moisture
    with uncertainty-aware decision making.
    """

    out = df.copy()

    irrigation_amounts = []
    predicted_moisture = []
    adjusted_moisture = []
    uncertainties = []

    adjusted_threshold = threshold + safety_margin

    for i in range(len(out)):
        if i < 7:
            irrigation_amounts.append(0.0)
            predicted_moisture.append(out.loc[i, "soil_moisture"])
            adjusted_moisture.append(out.loc[i, "soil_moisture"])
            uncertainties.append(0.0)
            continue

        row = out.iloc[i]

        # Build features
        feature_dict = {
            "rainfall": row["rainfall"],
            "soil_moisture": row["soil_moisture"],
            "temperature": row["temperature"],
        }

        for lag in range(1, 8):
            feature_dict[f"soil_moisture_lag_{lag}"] = out.loc[i - lag, "soil_moisture"]
            feature_dict[f"rainfall_lag_{lag}"] = out.loc[i - lag, "rainfall"]
            feature_dict[f"temperature_lag_{lag}"] = out.loc[i - lag, "temperature"]

        features_df = pd.DataFrame(
            [[feature_dict[col] for col in feature_columns]],
            columns=feature_columns
        )

        # ✅ FIX: convert to numpy (removes sklearn warning)
        features_array = features_df.to_numpy()

        # -------- Uncertainty --------
        tree_preds = [tree.predict(features_array)[0] for tree in model.estimators_]

        pred = sum(tree_preds) / len(tree_preds)
        uncertainty = pd.Series(tree_preds).std()

        predicted_moisture.append(pred)
        uncertainties.append(uncertainty)

        # -------- Risk-aware decision --------
        risk_adjusted_pred = pred - uncertainty

        if risk_adjusted_pred < adjusted_threshold:
            needed = adjusted_threshold - risk_adjusted_pred
            irrigation = max(0.0, min(needed, max_irrigation))
        else:
            irrigation = 0.0

        irrigation_amounts.append(irrigation)

        # Apply efficiency
        adjusted = pred + irrigation * irrigation_efficiency
        adjusted_moisture.append(adjusted)

    out["predicted_moisture"] = predicted_moisture
    out["uncertainty"] = uncertainties
    out["smart_irrigation"] = irrigation_amounts
    out["adjusted_moisture"] = adjusted_moisture

    return out