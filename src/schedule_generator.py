import pandas as pd


def mm_to_liters(irrigation_mm, area_value, area_unit):
    if area_unit == "acres":
        return irrigation_mm * area_value * 4046.86
    elif area_unit == "hectares":
        return irrigation_mm * area_value * 10000
    else:
        raise ValueError("Unsupported area unit")


def generate_future_schedule(
    df,
    model,
    feature_columns,
    threshold,
    target,
    area_value=1.0,
    area_unit="acres",
    days_ahead=5,
    max_irrigation=0.05,
    safety_margin=0.015,
    irrigation_efficiency=0.65
):
    """
    Generate future irrigation schedule with uncertainty-aware output.
    """
    history = df.copy().reset_index(drop=True)
    future_rows = []

    adjusted_threshold = threshold + safety_margin

    for day_idx in range(1, days_ahead + 1):
        future_rainfall = 0.0
        future_temperature = history["temperature"].tail(3).mean()
        current_soil_moisture = history.iloc[-1]["soil_moisture"]

        feature_dict = {
            "rainfall": future_rainfall,
            "soil_moisture": current_soil_moisture,
            "temperature": future_temperature,
        }

        for lag in range(1, 8):
            feature_dict[f"soil_moisture_lag_{lag}"] = history.iloc[-lag]["soil_moisture"]
            feature_dict[f"rainfall_lag_{lag}"] = history.iloc[-lag]["rainfall"]
            feature_dict[f"temperature_lag_{lag}"] = history.iloc[-lag]["temperature"]

        features_df = pd.DataFrame(
            [[feature_dict[col] for col in feature_columns]],
            columns=feature_columns
        )

        features_array = features_df.to_numpy()

        # Mean prediction from forest
        pred = model.predict(features_array)[0]

        # Uncertainty from tree spread
        tree_preds = [tree.predict(features_array)[0] for tree in model.estimators_]
        uncertainty = pd.Series(tree_preds).std()

        # Risk-aware prediction
        risk_adjusted_pred = pred - uncertainty

        if risk_adjusted_pred < adjusted_threshold:
            needed = adjusted_threshold - risk_adjusted_pred
            irrigation_mm = max(0.0, min(needed, max_irrigation))
        else:
            irrigation_mm = 0.0

        adjusted_moisture = pred + irrigation_mm * irrigation_efficiency
        liters = mm_to_liters(irrigation_mm, area_value, area_unit)

        future_rows.append({
            "forecast_day": day_idx,
            "predicted_soil_moisture": round(pred, 4),
            "uncertainty": round(uncertainty, 4),
            "risk_adjusted_moisture": round(risk_adjusted_pred, 4),
            "irrigation_mm": round(irrigation_mm, 4),
            "irrigation_liters": round(liters, 2),
            "adjusted_moisture": round(adjusted_moisture, 4)
        })

        new_row = {
            "date": None,
            "rainfall": future_rainfall,
            "soil_moisture": adjusted_moisture,
            "temperature": future_temperature
        }

        history = pd.concat([history, pd.DataFrame([new_row])], ignore_index=True)

    return pd.DataFrame(future_rows)