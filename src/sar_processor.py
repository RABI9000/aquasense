import rasterio
import numpy as np


def extract_mean_backscatter(tiff_path):
    with rasterio.open(tiff_path) as src:
        band = src.read(1).astype(float)

        # Remove invalid / non-positive values
        valid = band[np.isfinite(band) & (band > 0)]

        if len(valid) == 0:
            raise ValueError(f"No valid pixels found in {tiff_path}")

        return float(np.mean(valid))


def compute_sar_proxy(vv_mean, vh_mean):
    """
    Build a simple SAR moisture proxy from VV and VH.

    With only one scene, we avoid aggressive normalization.
    This proxy is just a relative wetness indicator.
    """
    # weighted blend
    proxy = 0.7 * vv_mean + 0.3 * vh_mean
    return float(proxy)


def minmax_scale(value, min_val, max_val):
    if max_val == min_val:
        return 0.5
    return (value - min_val) / (max_val - min_val)