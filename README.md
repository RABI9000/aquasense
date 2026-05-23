# 🌱 AquaSense — Smart Irrigation Platform

> SAR + Machine Learning irrigation scheduler for the Ahmednagar pilot farm.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/RABI9000/aquasense)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https%3A%2F%2Fgithub.com%2FRABI9000%2Faquasense)

Live repo: <https://github.com/RABI9000/aquasense>

See **[DEPLOY.md](./DEPLOY.md)** for the full deployment guide.

---

## 📌 Overview

AquaSense is an **intelligent irrigation scheduling system** built around a real
1.2-acre pilot field in Ahmednagar, Maharashtra. It combines:

- 🛰️ **Satellite SAR data** (Sentinel-1 VV/VH bands)
- 🧠 **Machine Learning** (Random Forest with uncertainty bands)
- 🌦️ **Live weather forecasts** (Open-Meteo, 7-day)
- 🌾 **Per-crop Kc coefficients** (FAO 30-crop dataset)
- ⚡ **Batch optimisation** for practical irrigation events

The Flask dashboard ships frontend + backend together — drop crops in,
hit Run, and see the schedule, plots, and water savings.

---

## 🎯 Problem statement

Traditional irrigation:
- Uses fixed moisture thresholds
- Ignores upcoming rainfall
- Treats every crop the same
- Triggers far too many small irrigation events

AquaSense fixes this with a **data-driven, crop-aware scheduler** that respects
weather forecasts and prediction uncertainty.

---

## 🧠 System architecture

```
Sentinel-1 SAR  →  Calibration  →  Soil-moisture correction
                                          ↓
       Historical CSV  →  Random Forest  →  Prediction + uncertainty
                                          ↓
     Open-Meteo API  →  5-day forecast  →  Smart scheduler (risk-aware)
                                          ↓
                                   Batch optimiser  →  Plan + plots
```

---

## ⚙️ Key features

| Module | What it does |
| --- | --- |
| **ML model** | 100-tree Random Forest, 7-lag features, RMSE ≈ 0.0095 |
| **SAR integration** | Sentinel-1 VV/VH calibrated against ground truth |
| **Smart scheduler** | Risk-adjusted irrigation (`pred − uncertainty`) |
| **Weather coupling** | Open-Meteo 7-day forecast feeds the simulator |
| **Batch optimiser** | 196 micro-events → ~71 practical events |
| **30-crop dataset** | FAO Kc coefficients for cereal · root · fruit · etc. |
| **Dashboard** | Flask + JS — tabs, modals, globe, theme toggle |

---

## 📊 Results (2023 season, wheat, mid-stage)

| Metric | Baseline | Smart | Batch |
| --- | --- | --- | --- |
| Total irrigation (mm) | 2.56 | 1.86 | 1.86 |
| Stress days | 64 | 0 | 0 |
| Irrigation events | 64 | 196 | 71 |

- 💧 **27.38 % water saved**
- 🌾 **100 % elimination of stress days**
- ⚡ **~64 % reduction in irrigation events** via batch scheduling

---

## 📅 Sample 5-day plan

```
Day 1 → 61.31 L
Day 2 → 56.94 L
Day 3 → 53.01 L
Day 4 → 51.69 L
Day 5 → 48.09 L
```

---

## 🛠️ Tech stack

- **Backend**: Python 3.11 · Flask · gunicorn
- **ML / Data**: scikit-learn · pandas · numpy · matplotlib
- **Optional**: TensorFlow / Keras (for the LSTM benchmark) · rasterio (SAR pre-processing)
- **Frontend**: HTML · CSS · Vanilla JS · Leaflet · Three.js + globe.gl
- **APIs**: Open-Meteo (live weather)

---

## ▶️ Run locally

### 1. Clone

```bash
git clone https://github.com/RABI9000/aquasense.git
cd aquasense
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate            # Windows:  venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> `requirements.txt` is the **lean production set** — Flask, pandas, numpy,
> scikit-learn, matplotlib, requests, gunicorn. About 30 s to install.
>
> If you also want the LSTM model comparison or SAR pre-processing, install
> the heavier set: `pip install -r requirement.txt` (note the singular).

### 4. Start the app

```bash
python app.py
```

Opens at **<http://localhost:5002>**.

### 5. Use it

1. The page loads on the **Overview** tab — multilingual greeting, live
   weather, rotating globe centred on Ahmednagar.
2. Click **Run simulation** in the bottom dock (or **Open simulator** on the
   Crops tab) — the form pops up.
3. Pick one or more crops from the dropdown (icons next to each), set the
   growth stage, and hit **Run simulation**.
4. Watch the per-crop progress steps, then the dashboard fills in:
   metrics · per-crop water plan · batch schedule · 5-day forecast · ML plots.

---

## 🚀 Deploy

One-click options (all already configured in this repo):

| Platform | How |
| --- | --- |
| **Render** | Click the badge above → sign in with GitHub → Apply |
| **Railway** | Click the Railway badge above |
| **Fly.io** | `flyctl launch && flyctl deploy` |
| **Docker** | `docker build -t aquasense . && docker run -p 8080:8080 aquasense` |
| **Heroku** | `git push heroku main` |

Files driving the deploys: `render.yaml`, `Procfile`, `runtime.txt`,
`Dockerfile`, `fly.toml`. Full walkthroughs in **[DEPLOY.md](./DEPLOY.md)**.

---

## 📁 Project structure

```
aquasense/
├── app.py                  # Flask entry — routes for /, /api/crops, /api/weather, /api/simulate
├── src/
│   ├── main.py             # run_simulation() — orchestrates everything
│   ├── ml_model.py         # Random Forest + model comparison
│   ├── smart_scheduler.py  # Risk-aware scheduler
│   ├── batch_scheduler.py  # Batch optimisation
│   ├── crop_manager.py     # Kc lookup for 30 crops
│   ├── weather_api.py      # Open-Meteo client
│   ├── schedule_generator.py
│   └── sar_*               # SAR calibration + correction
├── templates/index.html    # Single-page dashboard
├── static/
│   ├── css/style.css
│   └── js/main.js          # Tabs, modals, globe, theme, animations
├── data/
│   ├── clean/              # Pre-processed CSVs (used at runtime)
│   └── raw/                # Source CSVs (precipitation, temperature)
├── results/                # Generated CSVs + plots
├── requirements.txt        # Production deps
├── requirement.txt         # Dev / data-pipeline deps (TF, rasterio)
├── Procfile · Dockerfile · render.yaml · fly.toml
└── DEPLOY.md
```

---

## 🧪 Endpoints

| Route | Method | Description |
| --- | --- | --- |
| `/` | GET | Renders the dashboard |
| `/api/crops` | GET | Full crop dataset (name + Kc + root depth) |
| `/api/weather` | GET | Live + 7-day forecast for Ahmednagar (Open-Meteo) |
| `/api/simulate` | POST | Runs the simulation for an array of crops |
| `/plots/<file>` | GET | Serves regenerated `.png` plots |

Example simulate payload:

```json
{
  "area": 1.0,
  "unit": "acres",
  "use_api": true,
  "crops": [
    { "crop_name": "wheat",  "crop_stage": "mid" },
    { "crop_name": "cotton", "crop_stage": "mid" }
  ]
}
```

---

## ⚠️ Limitations

- SAR dataset is monthly (Sentinel-1 revisit cadence)
- Linear SAR calibration model (could be enhanced with a neural calibration)
- Single field — no multi-region scaling yet

---

## 🚀 Future work

- 🌍 Multi-region scalability (more pilots beyond Ahmednagar)
- 🤖 Stronger ML models (XGBoost, transformer time-series)
- 📱 Native mobile app wrapper
- 🔔 Push notifications for irrigation events
- 🛰️ Higher-cadence satellite data fusion

---

## 👨‍💻 Author

**RABI SHAIKH**

---

## ⭐ Support

If this project helps you, drop a ⭐ on GitHub. Pull requests and issues
welcome.
