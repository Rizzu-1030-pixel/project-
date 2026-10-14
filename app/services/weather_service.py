import httpx
from datetime import datetime
from typing import Dict, Any, List
from ..config import OPEN_METEO_BASE_URL, DEFAULT_LAT, DEFAULT_LON, DEFAULT_LOCATION_NAME
from ..models.schemas import WeatherResponse, WeatherCurrent, WeatherForecastDay, WeatherAlert

WMO_CODES = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    48: "Depositing rime fog 🌫️",
    51: "Light drizzle 🌦️",
    53: "Moderate drizzle 🌦️",
    55: "Dense drizzle 🌧️",
    61: "Slight rain 🌧️",
    63: "Moderate rain 🌧️",
    65: "Heavy rain ⛈️",
    71: "Slight snow ❄️",
    73: "Moderate snow ❄️",
    75: "Heavy snow ❄️",
    80: "Slight rain showers 🌦️",
    81: "Moderate rain showers 🌧️",
    82: "Violent rain showers ⛈️",
    95: "Thunderstorm 🌩️",
    96: "Thunderstorm with slight hail ⛈️",
    99: "Thunderstorm with heavy hail ⛈️"
}

FALLBACK_WEATHER = {
    "location": DEFAULT_LOCATION_NAME,
    "latitude": DEFAULT_LAT,
    "longitude": DEFAULT_LON,
    "current": {
        "temperature": 29.5,
        "humidity": 68.0,
        "wind_speed": 12.4,
        "precipitation": 0.0,
        "weather_code": 1,
        "weather_desc": "Mainly clear 🌤️",
        "is_day": True
    },
    "forecast": [
        {"date": "2026-10-14", "day_name": "Today", "temp_max": 32.0, "temp_min": 22.5, "precipitation_sum": 0.0, "precipitation_probability": 10, "weather_code": 1, "weather_desc": "Mainly clear 🌤️", "farming_advisory": "Ideal day for field harvesting, soil aeration, and pesticide application."},
        {"date": "2026-10-15", "day_name": "Tomorrow", "temp_max": 31.2, "temp_min": 23.0, "precipitation_sum": 2.5, "precipitation_probability": 35, "weather_code": 2, "weather_desc": "Partly cloudy ⛅", "farming_advisory": "Good conditions for weeding and transplanting."},
        {"date": "2026-10-16", "day_name": "Friday", "temp_max": 28.5, "temp_min": 21.0, "precipitation_sum": 18.0, "precipitation_probability": 75, "weather_code": 61, "weather_desc": "Moderate rain 🌧️", "farming_advisory": "Rain expected. Postpone fertilizer broadcasting and irrigation."},
        {"date": "2026-10-17", "day_name": "Saturday", "temp_max": 27.0, "temp_min": 20.0, "precipitation_sum": 28.0, "precipitation_probability": 85, "weather_code": 65, "weather_desc": "Heavy rain ⛈️", "farming_advisory": "Clear field drainage channels to prevent waterlogging around roots."},
        {"date": "2026-10-18", "day_name": "Sunday", "temp_max": 29.0, "temp_min": 21.5, "precipitation_sum": 4.0, "precipitation_probability": 40, "weather_code": 80, "weather_desc": "Slight rain showers 🌦️", "farming_advisory": "Scout for fungal leaf spots after moisture drying."},
        {"date": "2026-10-19", "day_name": "Monday", "temp_max": 31.0, "temp_min": 22.0, "precipitation_sum": 0.0, "precipitation_probability": 15, "weather_code": 0, "weather_desc": "Clear sky ☀️", "farming_advisory": "Sunny day. Suitable for sun-drying grain and spraying foliar nutrients."},
        {"date": "2026-10-20", "day_name": "Tuesday", "temp_max": 32.5, "temp_min": 22.8, "precipitation_sum": 0.0, "precipitation_probability": 5, "weather_code": 0, "weather_desc": "Clear sky ☀️", "farming_advisory": "Resume normal drip irrigation cycles."}
    ],
    "alerts": [
        {
            "severity": "Advisory",
            "title": "Humid Weather & Fungal Spore Warning",
            "description": "Relative humidity above 75% in the evening combined with warm daytime temperatures creates favorable microclimate for foliar blights.",
            "farming_precaution": "Scout tomato, potato, and paddy crops regularly. Apply preventive organic neem or bio-fungicide sprays early morning.",
            "affected_crops": ["Tomato", "Potato", "Rice", "Chili"]
        }
    ],
    "agricultural_summary": "Current conditions are favorable for kharif crop maturation and rabi field preparation. Rain expected in 2 days."
}


def generate_alerts(current_temp: float, current_humidity: float, forecast_days: List[Dict[str, Any]]) -> List[WeatherAlert]:
    alerts = []
    
    # 1. High rain alert
    rain_heavy = [day for day in forecast_days if day.get("precipitation_sum", 0) >= 25.0]
    if rain_heavy:
        dates = ", ".join([d["day_name"] for d in rain_heavy])
        alerts.append(WeatherAlert(
            severity="Warning",
            title=f"Heavy Rainfall Alert ({dates})",
            description=f"Forecast indicates intense showers exceeding 25mm. High risk of waterlogging and nutrient leaching.",
            farming_precaution="Ensure field drainage ditches and bunds are open. Cease all chemical spraying 24 hours prior to avoid runoff.",
            affected_crops=["Cotton", "Tomato", "Maize", "Pulses"]
        ))
        
    # 2. Extreme heat alert
    if current_temp >= 38.0 or any(d.get("temp_max", 0) >= 38.0 for d in forecast_days[:2]):
        alerts.append(WeatherAlert(
            severity="Warning",
            title="Heat Stress & High Evaporation Alert",
            description="Temperatures exceeding 38°C. Rapid soil moisture loss and floral abortion risks in standing crops.",
            farming_precaution="Irrigate during early morning or late dusk using drip systems. Apply straw or plastic mulching to conserve moisture.",
            affected_crops=["Vegetables", "Banana", "Papaya", "Pigeonpeas"]
        ))
        
    # 3. High humidity disease risk
    if current_humidity >= 78.0 and current_temp >= 20.0:
        alerts.append(WeatherAlert(
            severity="Advisory",
            title="Elevated Fungal & Bacterial Blight Risk",
            description=f"High ambient moisture ({current_humidity:.0f}%) accelerates spore germination for Alternaria and Phytophthora pathogens.",
            farming_precaution="Inspect lower foliage for water-soaked lesions or concentric rings. Ensure adequate canopy aeration.",
            affected_crops=["Tomato", "Potato", "Apple", "Rice", "Grapes"]
        ))

    # 4. Frost / Cold alert
    if current_temp <= 8.0 or any(d.get("temp_min", 99) <= 8.0 for d in forecast_days[:2]):
        alerts.append(WeatherAlert(
            severity="Watch",
            title="Cold Wave & Frost Injury Warning",
            description="Night temperatures dipping under 8°C can cause chilling injury to tender seedlings.",
            farming_precaution="Provide light protective evening irrigation to stabilize ground temperature. Cover nursery beds.",
            affected_crops=["Tomato", "Potato", "Capsicum", "Young Orchard Plants"]
        ))
        
    return alerts


def get_farming_advisory_for_day(code: int, tmax: float, rain: float) -> str:
    if rain >= 20:
        return "Heavy rainfall expected. Ensure drainage is clear and postpone all fertilization."
    elif rain >= 5:
        return "Showers forecasted. Turn off automated irrigation systems to conserve water."
    elif tmax >= 36:
        return "Hot day. Schedule irrigation during evening hours to minimize evaporation losses."
    elif code in [0, 1]:
        return "Optimal clear weather for field scouting, weeding, and foliar spray application."
    else:
        return "Favorable farming conditions. Maintain standard cultural practices."


async def get_weather(lat: float = DEFAULT_LAT, lon: float = DEFAULT_LON, location_name: str = DEFAULT_LOCATION_NAME) -> WeatherResponse:
    try:
        url = (
            f"{OPEN_METEO_BASE_URL}?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m"
            f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max"
            f"&timezone=auto"
        )
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                curr = data.get("current", {})
                daily = data.get("daily", {})
                
                c_temp = float(curr.get("temperature_2m", 28.0))
                c_hum = float(curr.get("relative_humidity_2m", 65.0))
                c_wind = float(curr.get("wind_speed_10m", 10.0))
                c_precip = float(curr.get("precipitation", 0.0))
                c_code = int(curr.get("weather_code", 1))
                c_desc = WMO_CODES.get(c_code, "Partly cloudy")
                c_is_day = bool(curr.get("is_day", 1))
                
                current_obj = WeatherCurrent(
                    temperature=c_temp,
                    humidity=c_hum,
                    wind_speed=c_wind,
                    precipitation=c_precip,
                    weather_code=c_code,
                    weather_desc=c_desc,
                    is_day=c_is_day
                )
                
                # Daily forecast
                time_list = daily.get("time", [])
                tmax_list = daily.get("temperature_2m_max", [])
                tmin_list = daily.get("temperature_2m_min", [])
                precip_list = daily.get("precipitation_sum", [])
                prob_list = daily.get("precipitation_probability_max", [])
                code_list = daily.get("weather_code", [])
                
                forecast_days = []
                for i in range(min(7, len(time_list))):
                    d_str = time_list[i]
                    d_obj = datetime.strptime(d_str, "%Y-%m-%d")
                    day_name = "Today" if i == 0 else ("Tomorrow" if i == 1 else d_obj.strftime("%A"))
                    tmax = float(tmax_list[i]) if i < len(tmax_list) else c_temp + 3
                    tmin = float(tmin_list[i]) if i < len(tmin_list) else c_temp - 5
                    psum = float(precip_list[i]) if i < len(precip_list) else 0.0
                    pprob = float(prob_list[i]) if i < len(prob_list) and prob_list[i] is not None else 10.0
                    wcode = int(code_list[i]) if i < len(code_list) else 1
                    wdesc = WMO_CODES.get(wcode, "Clear")
                    adv = get_farming_advisory_for_day(wcode, tmax, psum)
                    
                    forecast_days.append({
                        "date": d_str,
                        "day_name": day_name,
                        "temp_max": tmax,
                        "temp_min": tmin,
                        "precipitation_sum": psum,
                        "precipitation_probability": pprob,
                        "weather_code": wcode,
                        "weather_desc": wdesc,
                        "farming_advisory": adv
                    })
                    
                forecast_objs = [WeatherForecastDay(**d) for d in forecast_days]
                alerts = generate_alerts(c_temp, c_hum, forecast_days)
                
                summary = (
                    f"Current temperature is {c_temp:.1f}°C with {c_hum:.0f}% humidity. "
                    f"7-day outlook shows max rainfall of {max([d['precipitation_sum'] for d in forecast_days]):.1f}mm."
                )
                
                return WeatherResponse(
                    location=location_name,
                    latitude=lat,
                    longitude=lon,
                    current=current_obj,
                    forecast=forecast_objs,
                    alerts=alerts,
                    agricultural_summary=summary
                )
    except Exception as e:
        print(f"Weather API fallback engaged due to: {e}")
        
    # Offline fallback
    current_fallback = WeatherCurrent(**FALLBACK_WEATHER["current"])
    forecast_fallback = [WeatherForecastDay(**d) for d in FALLBACK_WEATHER["forecast"]]
    alerts_fallback = [WeatherAlert(**a) for a in FALLBACK_WEATHER["alerts"]]
    return WeatherResponse(
        location=location_name,
        latitude=lat,
        longitude=lon,
        current=current_fallback,
        forecast=forecast_fallback,
        alerts=alerts_fallback,
        agricultural_summary=FALLBACK_WEATHER["agricultural_summary"]
    )
