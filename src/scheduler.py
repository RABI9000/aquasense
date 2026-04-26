import math

def decide_irrigation(x_est, variance, threshold, target, max_irrigation=20, z=1.0, alpha=0.7):
    x_safe = x_est - z * math.sqrt(max(variance, 0))

    if x_safe < threshold:
        blended_moisture = alpha * x_safe + (1 - alpha) * x_est
        deficit = max(0, target - blended_moisture)
        irrigation = min(max_irrigation, deficit)
    else:
        irrigation = 0

    return irrigation, x_safe