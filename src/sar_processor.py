import rasterio
import numpy as np
import scipy.ndimage as ndimage


def apply_lee_filter(img, size=3):
    """
    Apply a local adaptive Lee filter to reduce multiplicative speckle noise
    while preserving high-frequency boundaries and structural details.
    """
    # Local mean and variance inside size x size neighborhood
    local_mean = ndimage.uniform_filter(img, (size, size))
    local_sqr_mean = ndimage.uniform_filter(img**2, (size, size))
    local_var = local_sqr_mean - local_mean**2

    # Overall speckle noise variance estimated across the scene
    overall_var = float(np.mean(local_var))

    # Safe division to prevent NaNs on uniform pixels
    local_var_safe = np.where(local_var == 0, 1e-9, local_var)

    # Adaptive gain factor: k = (var_L - var_N) / var_L
    k = (local_var_safe - overall_var) / local_var_safe
    k = np.clip(k, 0, 1)

    # Lee filtered image
    filtered = local_mean + k * (img - local_mean)
    return filtered


def extract_mean_backscatter(tiff_path):
    with rasterio.open(tiff_path) as src:
        band = src.read(1).astype(float)

        # Clean invalid or non-positive values before filtering
        invalid_mask = ~np.isfinite(band) | (band <= 0)
        mean_val = np.nanmean(band[~invalid_mask]) if np.any(~invalid_mask) else 0.0
        band_clean = np.where(invalid_mask, mean_val, band)

        # Apply a 3x3 Lee Filter (as documented in Section III.C of the research paper)
        filtered_band = apply_lee_filter(band_clean, size=3)

        # Remove invalid pixels from final averaging
        valid = filtered_band[~invalid_mask]

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