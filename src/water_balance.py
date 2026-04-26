def update_root_zone(x_prev, rain, et, irrigation, fc, wp, kd=0.3):
    """
    Update root-zone moisture for one day.

    Parameters:
        x_prev (float): previous day's root-zone moisture (mm)
        rain (float): rainfall for the day (mm)
        et (float): evapotranspiration loss for the day (mm)
        irrigation (float): irrigation applied for the day (mm)
        fc (float): field capacity (mm)
        wp (float): wilting point (mm)
        kd (float): drainage coefficient for excess water above FC

    Returns:
        float: updated root-zone moisture (mm)
    """
    drainage = max(0, x_prev - fc) * kd
    x_new = x_prev + rain + irrigation - et - drainage

    # Keep within physical limits
    x_new = max(wp, x_new)

    return x_new