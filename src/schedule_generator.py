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
    crop_kc=1.0,   # ✅ NEW
    area_value=1.0,
    area_unit="acres",
    days_ahead=5,
    max_irrigation=0.05,
    safety_margin=0.005,
    irrigation_efficiency=0.65,
    future_forecast=None
):
    history = df.copy().reset_index(drop=True)
    future_rows = []

    moisture_col = "sar_corrected_moisture" if "sar_corrected_moisture" in history.columns else "soil_moisture"

    adjusted_threshold = threshold + safety_margin
    uncertainty_weight = 0.4

    for day_idx in range(1, days_ahead + 1):

        if future_forecast is not None:
            future_rainfall = future_forecast[day_idx - 1]["rainfall"]
            future_temperature = future_forecast[day_idx - 1]["temperature"]
        else:
            future_rainfall = 0.0
            future_temperature = history["temperature"].tail(7).mean()

        current_soil_moisture = history.iloc[-1][moisture_col]

        feature_dict = {
            "rainfall": future_rainfall,
            "soil_moisture": current_soil_moisture,
            "temperature": future_temperature,
        }

        for lag in range(1, 8):
            feature_dict[f"soil_moisture_lag_{lag}"] = history.iloc[-lag][moisture_col]
            feature_dict[f"rainfall_lag_{lag}"] = history.iloc[-lag]["rainfall"]
            feature_dict[f"temperature_lag_{lag}"] = history.iloc[-lag]["temperature"]

        features_df = pd.DataFrame(
            [[feature_dict[col] for col in feature_columns]],
            columns=feature_columns
        )

        features_array = features_df.to_numpy()

        pred = model.predict(features_array)[0]

        tree_preds = [tree.predict(features_array)[0] for tree in model.estimators_]
        uncertainty = pd.Series(tree_preds).std()

        risk_adjusted_pred = pred - uncertainty_weight * uncertainty

        # -------- Crop-aware irrigation --------
        if risk_adjusted_pred < adjusted_threshold:
            needed = adjusted_threshold - risk_adjusted_pred

            # ✅ APPLY CROP EFFECT
            irrigation_mm = needed * crop_kc

            irrigation_mm = max(0.0, min(irrigation_mm, max_irrigation))
        else:
            irrigation_mm = 0.0

        adjusted_moisture = pred + irrigation_mm * irrigation_efficiency
        liters = mm_to_liters(irrigation_mm, area_value, area_unit)

        future_rows.append({
            "forecast_day": day_idx,
            "forecast_rainfall": round(future_rainfall, 2),
            "forecast_temperature": round(future_temperature, 2),
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
            "sar_corrected_moisture": adjusted_moisture,
            "temperature": future_temperature
        }

        history = pd.concat([history, pd.DataFrame([new_row])], ignore_index=True)

    return pd.DataFrame(future_rows)