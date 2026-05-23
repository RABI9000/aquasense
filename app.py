from flask import Flask, render_template, request, jsonify, send_from_directory
import pandas as pd
import os
import sys
import requests
from datetime import datetime

# Add src to path so we can import from it
sys.path.append(os.path.abspath("src"))
from main import run_simulation
from crop_manager import load_crop_dataset, get_crop_settings

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Constants — we anchor the platform to a single farm in Ahmednagar.
# ---------------------------------------------------------------------------
AHMEDNAGAR_LAT = 19.0948
AHMEDNAGAR_LON = 74.7480
AHMEDNAGAR_NAME = "Ahmednagar, Maharashtra"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/crops")
def get_crops():
    """Return the complete crop dataset (name + Kc + root depth) for the UI."""
    df = pd.read_csv("data/clean/crop_dataset.csv")
    crops = df.to_dict(orient="records")
    return jsonify(crops)


@app.route("/api/location")
def get_location():
    """Return the farm location anchor used by the dashboard."""
    return jsonify({
        "name": AHMEDNAGAR_NAME,
        "lat": AHMEDNAGAR_LAT,
        "lon": AHMEDNAGAR_LON
    })


@app.route("/api/weather")
def get_weather():
    """
    Live weather for the Ahmednagar farm + 7-day forecast.
    Falls back to the bundled forecast CSV if the network call fails so the
    UI always has something to render.
    """
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": AHMEDNAGAR_LAT,
            "longitude": AHMEDNAGAR_LON,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
            "daily": "temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,weather_code,wind_speed_10m_max",
            "forecast_days": 7,
            "timezone": "auto"
        }
        r = requests.get(url, params=params, timeout=15)
        r.raise_for_status()
        data = r.json()

        current = data.get("current", {})
        daily = data.get("daily", {})

        forecast = []
        for i, date in enumerate(daily.get("time", [])):
            forecast.append({
                "date": date,
                "temp_max": daily["temperature_2m_max"][i],
                "temp_min": daily["temperature_2m_min"][i],
                "temp_mean": daily["temperature_2m_mean"][i],
                "rainfall": daily["precipitation_sum"][i],
                "weather_code": daily["weather_code"][i],
                "wind_speed_max": daily["wind_speed_10m_max"][i]
            })

        return jsonify({
            "status": "live",
            "location": AHMEDNAGAR_NAME,
            "lat": AHMEDNAGAR_LAT,
            "lon": AHMEDNAGAR_LON,
            "fetched_at": datetime.utcnow().isoformat() + "Z",
            "current": {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "precipitation": current.get("precipitation"),
                "weather_code": current.get("weather_code"),
                "wind_speed": current.get("wind_speed_10m")
            },
            "forecast": forecast
        })

    except Exception as e:
        # Fallback to bundled forecast CSV
        try:
            fut = pd.read_csv("results/future_schedule.csv")
            forecast = []
            for _, row in fut.iterrows():
                forecast.append({
                    "date": f"Day {int(row['forecast_day'])}",
                    "temp_max": float(row["forecast_temperature"]) + 3,
                    "temp_min": float(row["forecast_temperature"]) - 3,
                    "temp_mean": float(row["forecast_temperature"]),
                    "rainfall": float(row["forecast_rainfall"]),
                    "weather_code": 0,
                    "wind_speed_max": 10.0
                })
            return jsonify({
                "status": "fallback",
                "location": AHMEDNAGAR_NAME,
                "lat": AHMEDNAGAR_LAT,
                "lon": AHMEDNAGAR_LON,
                "fetched_at": datetime.utcnow().isoformat() + "Z",
                "current": {
                    "temperature": 28.0,
                    "humidity": 55,
                    "precipitation": 0.0,
                    "weather_code": 0,
                    "wind_speed": 12.0
                },
                "forecast": forecast,
                "error": str(e)
            })
        except Exception:
            return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/simulate", methods=["POST"])
def simulate():
    """
    Run the full simulation for one or more crops on the Ahmednagar farm.
    Request body:
      {
        "area": 1.0,
        "unit": "acres",
        "use_api": true,
        "crops": [{"crop_name": "wheat", "crop_stage": "mid"}, ...]
      }
    """
    data = request.json or {}
    area = float(data.get("area", 1.0))
    unit = data.get("unit", "acres")
    use_api = bool(data.get("use_api", True))

    # Anchor location to Ahmednagar
    lat = AHMEDNAGAR_LAT
    lon = AHMEDNAGAR_LON

    # Support both legacy single-crop and new multi-crop payloads
    crops_input = data.get("crops")
    if not crops_input:
        crops_input = [{
            "crop_name": data.get("crop_name", "wheat"),
            "crop_stage": data.get("crop_stage", "mid")
        }]

    try:
        per_crop_results = []
        shared = {}

        for idx, c in enumerate(crops_input):
            crop_name = c.get("crop_name", "wheat")
            crop_stage = c.get("crop_stage", "mid")
            results = run_simulation(area, unit, use_api, lat, lon, crop_name, crop_stage)

            # Shared (model-level) results we only need once for the dashboard
            if idx == 0:
                shared = {
                    "rmse": results["rmse"],
                    "model_comparison": results["model_comparison"],
                    "comparison": results["comparison"]
                }

            per_crop_results.append({
                "crop": results["crop"],
                "batch_total": results["batch_total"],
                "batch_days": results["batch_days"],
                "schedule": results["schedule"]
            })

        # Aggregate metrics across all selected crops
        total_water = sum(c["batch_total"] for c in per_crop_results)
        total_irrigation_days = sum(c["batch_days"] for c in per_crop_results)

        return jsonify({
            "status": "success",
            "data": {
                "rmse": shared.get("rmse"),
                "model_comparison": shared.get("model_comparison"),
                "comparison": shared.get("comparison"),
                "crops": per_crop_results,
                "total_water": total_water,
                "total_irrigation_days": total_irrigation_days,
                "num_crops": len(per_crop_results),
                "location": {
                    "name": AHMEDNAGAR_NAME,
                    "lat": AHMEDNAGAR_LAT,
                    "lon": AHMEDNAGAR_LON
                }
            }
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 400


@app.route("/plots/<filename>")
def serve_plot(filename):
    return send_from_directory(os.path.abspath("results/plots"), filename)


if __name__ == "__main__":
    app.run(debug=True, port=5002)
