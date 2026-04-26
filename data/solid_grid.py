import rasterio
import os

# ✅ Set this to your folder where .tif files are stored
BASE_PATH = "raw/soil_properties"

lat = 18.9990
lon = 75.2421

def get_value(filename):
    tif_path = os.path.join(BASE_PATH, filename)
    
    # Debug check (optional but useful)
    if not os.path.exists(tif_path):
        raise FileNotFoundError(f"File not found: {tif_path}")
    
    with rasterio.open(tif_path) as src:
        row, col = src.index(lon, lat)
        value = src.read(1)[row, col]
    return value

# -------------------------------
# Wilting Point (-1500 kPa)
# -------------------------------
wp_0_5 = get_value("vwc_1500kpa_0_5.tif")
wp_5_15 = get_value("vwc_1500kpa_5_15.tif")
wp_15_30 = get_value("vwc_1500kpa_15_30.tif")

# Weighted average (0–30 cm)
wp_raw = (5 * wp_0_5 + 10 * wp_5_15 + 15 * wp_15_30) / 30

print("\n--- Wilting Point ---")
print("WP raw (-1500 kPa):", wp_raw)

# -------------------------------
# Field Capacity (33 kPa)
# -------------------------------
fc_0_5 = get_value("vwc_33kpa_0_5.tif")
fc_5_15 = get_value("vwc_33kpa_5_15.tif")
fc_15_30 = get_value("vwc_33kpa_15_30.tif")

fc_raw = (5 * fc_0_5 + 10 * fc_5_15 + 15 * fc_15_30) / 30

# -------------------------------
# Wet Reference (10 kPa)
# -------------------------------
wet_0_5 = get_value("vwc_10kpa_0_5.tif")
wet_5_15 = get_value("vwc_10kpa_5_15.tif")
wet_15_30 = get_value("vwc_10kpa_15_30.tif")

wet_raw = (5 * wet_0_5 + 10 * wet_5_15 + 15 * wet_15_30) / 30

# -------------------------------
# Final Values (converted)
# -------------------------------
fc = fc_raw / 1000
wet = wet_raw / 1000
wp = wp_raw / 1000

print("\n--- Final Values ---")
print("FC:", fc)
print("Wet reference:", wet)
print("WP:", wp)
print("Available water (FC - WP):", fc - wp)

print("\n--- Raw Values ---")
print("FC raw:", fc_raw)
print("Wet raw:", wet_raw)