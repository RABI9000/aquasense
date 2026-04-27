# 🌱 Smart Irrigation System using SAR + Machine Learning

## 📌 Overview
This project implements an **intelligent irrigation scheduling system** that combines:

- Machine Learning (Random Forest)
- Satellite SAR data (Sentinel-1)
- Weather forecasts (API-based)
- Uncertainty-aware decision making

The system optimizes irrigation to:
- 💧 Reduce water usage  
- 🌾 Prevent crop stress  
- ⚙️ Improve real-world usability with batch irrigation  

---

## 🎯 Problem Statement
Traditional irrigation systems:
- Use fixed thresholds  
- Ignore weather forecasts  
- Lead to over-irrigation or crop stress  

This project addresses these limitations by building a **data-driven irrigation scheduler**.

---

## 🧠 System Architecture
SAR Data → Calibration → Soil Moisture Correction
↓
Historical Data → ML Model → Prediction + Uncertainty
↓
Weather Forecast → Future Simulation
↓
Smart Scheduler → Batch Optimization

---

## ⚙️ Key Features

### ✅ Machine Learning Model
- Random Forest Regressor  
- Time-series lag features  
- RMSE ≈ **0.0095**

---

### ✅ SAR Integration
- Uses Sentinel-1 VV & VH bands  
- Linear calibration model  
- Improves soil moisture estimation accuracy  

---

### ✅ Smart Irrigation Scheduler
- Predicts future soil moisture  
- Uses uncertainty-aware decision logic:
risk_adjusted = prediction - uncertainty

- Prevents under-irrigation risk  

---

### ✅ Weather API Integration
- Real-time 5-day forecast  
- Improves irrigation planning accuracy  

---

### ✅ Batch Irrigation Optimization
- Converts frequent small irrigation → practical events  
- Reduces operational complexity  

---

## 📊 Results

| Metric | Baseline | Smart | Batch |
|-------|--------|------|------|
| Total Irrigation | 2.56 | 1.86 | 1.86 |
| Stress Days | 64 | 0 | 0 |
| Irrigation Days | 64 | 196 | 71 |

### 🔥 Key Outcomes:
- **27.38% water saved**
- **100% elimination of stress days**
- **~64% reduction in irrigation events using batch scheduling**

---

## 📅 Sample Output
Next 5-Day Irrigation Schedule:

Day 1 → 61.31 liters
Day 2 → 56.94 liters
Day 3 → 53.01 liters
Day 4 → 51.69 liters
Day 5 → 48.09 liters
---

## 📈 Visualizations

The system generates and saves plots in `results/plots/`:

- Observed vs Predicted Soil Moisture  
- Baseline Irrigation Schedule  
- Smart Irrigation Schedule  
- Batch Irrigation Schedule  
- Rainfall & Temperature Trends  

---

## 🛠️ Tech Stack

- Python  
- Pandas, NumPy  
- Scikit-learn  
- Matplotlib  
- Rasterio (SAR processing)  
- Open-Meteo Weather API  

---

## ▶️ How to Run

```bash
git clone https://github.com/<your-username>/smart-irrigation-system.git
cd irrigation_project

pip install -r requirements.txt

python src/main.py
```


⸻

⚠️ Limitations
	•	No crop-specific water requirement modeling yet
	•	Limited SAR dataset (monthly samples)
	•	Uses linear SAR calibration

⸻

🚀 Future Work
	•	🌱 Crop-aware irrigation scheduling
	•	🌍 Multi-region scalability
	•	🤖 Advanced ML models (XGBoost / LSTM)
	•	☁️ Deploy as a web dashboard

⸻

👩‍💻 Author

Pranjali Narote

⸻

⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!