import glob
import os
import re

import numpy as np
import pandas as pd
import rasterio


def extract_date_from_filename(filename):
    match = re.search(r"(\d{8})t", filename.lower())
    if not match:
        raise ValueError(f"Could not extract date from filename: {filename}")

    return pd.to_datetime(match.group(1), format="%Y%m%d")


def extract_polarization(filename):
    name = filename.lower()

    if "-vv-" in name or "_vv_" in name:
        return "vv"
    if "-vh-" in name or "_vh_" in name:
        return "vh"

    return None


def extract_mean_backscatter(tiff_path):
    with rasterio.open(tiff_path) as src:
        band = src.read(1).astype(float)

        valid = band[np.isfinite(band) & (band > 0)]

        if len(valid) == 0:
            raise ValueError(f"No valid pixels found in {tiff_path}")

        return float(np.mean(valid))


def compute_sar_proxy(vv_mean, vh_mean):
    return 0.7 * vv_mean + 0.3 * vh_mean


def build_sar_timeseries(sar_folder, output_csv):
    tiff_files = sorted(
        glob.glob(os.path.join(sar_folder, "*.tif")) +
        glob.glob(os.path.join(sar_folder, "*.tiff"))
    )

    if not tiff_files:
        raise FileNotFoundError(f"No TIFF files found in {sar_folder}")

    records = {}

    for path in tiff_files:
        filename = os.path.basename(path)
        date = extract_date_from_filename(filename)
        pol = extract_polarization(filename)

        if pol is None:
            print(f"Skipping {filename}: could not identify VV/VH")
            continue

        mean_value = extract_mean_backscatter(path)

        if date not in records:
            records[date] = {"date": date}

        records[date][f"{pol}_mean"] = round(mean_value, 4)
        records[date][f"{pol}_file"] = filename

    rows = []

    for date, record in records.items():
        if "vv_mean" not in record or "vh_mean" not in record:
            print(f"Skipping {date.date()}: missing VV or VH pair")
            continue

        vv_mean = record["vv_mean"]
        vh_mean = record["vh_mean"]

        rows.append({
            "date": date,
            "vv_mean": vv_mean,
            "vh_mean": vh_mean,
            "sar_proxy": round(compute_sar_proxy(vv_mean, vh_mean), 4),
            "vv_file": record.get("vv_file"),
            "vh_file": record.get("vh_file")
        })

    sar_df = pd.DataFrame(rows).sort_values("date").reset_index(drop=True)

    os.makedirs(os.path.dirname(output_csv), exist_ok=True)
    sar_df.to_csv(output_csv, index=False)

    print("\n✅ SAR time series created:")
    print(sar_df.to_string(index=False))

    return sar_df


if __name__ == "__main__":
    build_sar_timeseries(
        sar_folder="data/raw/sar",
        output_csv="data/clean/sar_timeseries.csv"
    )