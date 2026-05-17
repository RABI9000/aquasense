from flask import Flask, render_template, request, jsonify, send_from_directory
import pandas as pd
import os
import sys

# Add src to path so we can import from it
sys.path.append(os.path.abspath("src"))
from main import run_simulation

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/crops")
def get_crops():
    df = pd.read_csv("data/clean/crop_dataset.csv")
    crops = df["crop_name"].tolist()
    return jsonify(crops)

@app.route("/api/simulate", methods=["POST"])
def simulate():
    data = request.json
    area = float(data.get("area", 1.0))
    unit = data.get("unit", "acres")
    use_api = data.get("use_api", False)
    lat = float(data.get("lat", 0.0))
    lon = float(data.get("lon", 0.0))
    crop_name = data.get("crop_name", "wheat")
    crop_stage = data.get("crop_stage", "mid")
    
    try:
        results = run_simulation(area, unit, use_api, lat, lon, crop_name, crop_stage)
        return jsonify({"status": "success", "data": results})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route("/plots/<filename>")
def serve_plot(filename):
    return send_from_directory(os.path.abspath("results/plots"), filename)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
