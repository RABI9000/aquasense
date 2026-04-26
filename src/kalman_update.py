def kalman_update(x_pred, p_pred, observation, r_meas, h=1.0):
    """
    Kalman-style measurement update.

    Parameters:
        x_pred (float): predicted state
        p_pred (float): predicted variance
        observation (float): observed value from SAR
        r_meas (float): observation noise
        h (float): observation mapping factor

    Returns:
        tuple: updated state, updated variance, kalman gain
    """
    k = (p_pred * h) / (h * h * p_pred + r_meas)
    x_updated = x_pred + k * (observation - h * x_pred)
    p_updated = (1 - k * h) * p_pred
    return x_updated, p_updated, k