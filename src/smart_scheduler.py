import pandas as pd


def run_smart_scheduler(
    df,
    model,
    feature_columns,
    threshold,
    target,
    max_irrigation=0.05,
    safety_margin=0.005,
    irrigation_efficiency=0.65
):
    out = df.copy()

    moisture_col = "sar_corrected_moisture" if "sar_corrected_moisture" in out.columns else "soil_moisture"

    irrigation_amounts = []
    predicted_moisture = []
    adjusted_moisture = []
    uncertainties = []

    adjusted_threshold = threshold + safety_margin

    for i in range(len(out)):
        if i < 7:
            irrigation_amounts.append(0.0)
            predicted_moisture.append(out.loc[i, moisture_col])
            adjusted_moisture.append(out.loc[i, moisture_col])
            uncertainties.append(0.0)
            continue

        row = out.iloc[i]

        feature_dict = {
            "rainfall": row["rainfall"],
            "soil_moisture": row[moisture_col],
            "temperature": row["temperature"],
        }

        for lag in range(1, 8):
            feature_dict[f"soil_moisture_lag_{lag}"] = out.loc[i - lag, moisture_col]
            feature_dict[f"rainfall_lag_{lag}"] = out.loc[i - lag, "rainfall"]
            feature_dict[f"temperature_lag_{lag}"] = out.loc[i - lag, "temperature"]

        features_df = pd.DataFrame(
            [[feature_dict[col] for col in feature_columns]],
            columns=feature_columns
        )

        features_array = features_df.to_numpy()

        tree_preds = [tree.predict(features_array)[0] for tree in model.estimators_]

        pred = sum(tree_preds) / len(tree_preds)
        uncertainty = pd.Series(tree_preds).std()

        predicted_moisture.append(pred)
        uncertainties.append(uncertainty)

        uncertainty_weight = 0.4
        risk_adjusted_pred = pred - uncertainty_weight * uncertainty

        if risk_adjusted_pred < adjusted_threshold:
            needed = adjusted_threshold - risk_adjusted_pred
            irrigation = max(0.0, min(needed, max_irrigation))
        else:
            irrigation = 0.0

        irrigation_amounts.append(irrigation)

        adjusted = pred + irrigation * irrigation_efficiency
        adjusted_moisture.append(adjusted)

    out["predicted_moisture"] = predicted_moisture
    out["uncertainty"] = uncertainties
    out["smart_irrigation"] = irrigation_amounts
    out["adjusted_moisture"] = adjusted_moisture

    return out