import os
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for web servers
import matplotlib.pyplot as plt
import pandas as pd

def generate_all_plots(baseline_df, smart_df, batch_df, comparison_df, schedule_df):
    plot_dir = "results/plots"
    os.makedirs(plot_dir, exist_ok=True)
    
    # Shared Style
    plt.style.use('dark_background')
    
    # 1. Observed vs Predicted
    plt.figure(figsize=(10, 5))
    if "date" in smart_df.columns:
        x = pd.to_datetime(smart_df["date"])
    else:
        x = range(len(smart_df))
    
    moisture_col = "sar_corrected_moisture" if "sar_corrected_moisture" in smart_df.columns else "soil_moisture"
    plt.plot(x, smart_df[moisture_col], label="Observed Moisture", color="#38bdf8", linewidth=2)
    plt.plot(x, smart_df["predicted_moisture"], label="Predicted Moisture", color="#f472b6", linestyle="--", linewidth=2)
    plt.title("1. Observed vs Predicted Soil Moisture")
    plt.ylabel("Volumetric Water Content")
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, "plot_1_moisture.png"), dpi=150)
    plt.close()
    
    # 2. Irrigation Comparison
    plt.figure(figsize=(10, 5))
    plt.plot(x, baseline_df["irrigation_amount"], label="Baseline", color="#94a3b8", alpha=0.6)
    plt.plot(x, smart_df["smart_irrigation"], label="Smart", color="#38bdf8", alpha=0.8)
    if batch_df is not None:
        plt.plot(x, batch_df["batch_irrigation"], label="Batch Smart", color="#34d399", linewidth=2)
    plt.title("2. Daily Irrigation Events Comparison")
    plt.ylabel("Irrigation Amount")
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, "plot_2_irrigation.png"), dpi=150)
    plt.close()
    
    # 3. Water Usage Comparison
    plt.figure(figsize=(8, 5))
    schedulers = comparison_df["scheduler"].tolist()
    # Shorten names for the plot labels
    short_labels = [s.replace("Smart SAR + Uncertainty", "Smart Scheduler").replace("Batch Smart Scheduler", "Batch Scheduler") for s in schedulers]
    water_used = comparison_df["total_irrigation"].tolist()
    colors = ['#94a3b8', '#38bdf8', '#34d399']
    plt.bar(short_labels, water_used, color=colors[:len(schedulers)])
    plt.title("3. Total Water Usage Comparison")
    plt.ylabel("Total Irrigation")
    for i, v in enumerate(water_used):
        plt.text(i, v + (max(water_used)*0.02), f"{v:.2f}", ha='center', color='white')
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, "plot_3_water_usage.png"), dpi=150)
    plt.close()
    
    # 4. Stress Days Comparison
    plt.figure(figsize=(8, 5))
    stress_days = comparison_df["stress_days"].tolist()
    plt.bar(short_labels, stress_days, color=['#ef4444', '#fb923c', '#facc15'][:len(schedulers)])
    plt.title("4. Crop Stress Days Comparison")
    plt.ylabel("Number of Stress Days")
    for i, v in enumerate(stress_days):
        plt.text(i, v + (max(stress_days+ [1])*0.02), str(v), ha='center', color='white')
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, "plot_4_stress_days.png"), dpi=150)
    plt.close()
    
    # 5. 5-Day Forecast Schedule
    fig, ax1 = plt.subplots(figsize=(10, 5))
    x_forecast = schedule_df["forecast_day"]
    
    ax1.set_xlabel('Forecast Day')
    ax1.set_ylabel('Predicted Moisture', color='#38bdf8')
    ax1.plot(x_forecast, schedule_df["predicted_soil_moisture"], color='#38bdf8', marker='o', label="Predicted Moisture")
    ax1.tick_params(axis='y', labelcolor='#38bdf8')
    ax1.set_xticks(x_forecast)
    ax1.set_xticklabels([f"Day {day}" for day in x_forecast])
    
    ax2 = ax1.twinx()
    ax2.set_ylabel('Planned Irrigation (Liters)', color='#34d399')
    ax2.bar(x_forecast, schedule_df["irrigation_liters"], color='#34d399', alpha=0.3, label="Planned Irrigation")
    ax2.tick_params(axis='y', labelcolor='#34d399')
    
    plt.title("5. Next 5-Day Forecast & Schedule")
    
    lines_1, labels_1 = ax1.get_legend_handles_labels()
    lines_2, labels_2 = ax2.get_legend_handles_labels()
    ax1.legend(lines_1 + lines_2, labels_1 + labels_2, loc='upper left')
    
    plt.tight_layout()
    plt.savefig(os.path.join(plot_dir, "plot_5_forecast.png"), dpi=150)
    plt.close()
