import requests


def get_weather_forecast(latitude, longitude, days_ahead=5):
    """
    Fetch daily weather forecast from Open-Meteo.

    Returns list of dictionaries:
    [
        {"rainfall": ..., "temperature": ...},
        ...
    ]
    """

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_mean,precipitation_sum",
        "forecast_days": days_ahead,
        "timezone": "auto"
    }

    response = requests.get(url, params=params, timeout=20)
    response.raise_for_status()

    data = response.json()

    dates = data["daily"]["time"]
    temperatures = data["daily"]["temperature_2m_mean"]
    rainfall = data["daily"]["precipitation_sum"]

    forecast = []

    for i in range(len(dates)):
        forecast.append({
            "date": dates[i],
            "rainfall": float(rainfall[i]),
            "temperature": float(temperatures[i])
        })

    return forecast