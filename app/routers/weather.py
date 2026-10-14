from fastapi import APIRouter, Query
from ..models.schemas import WeatherResponse
from ..services.weather_service import get_weather
from ..config import DEFAULT_LAT, DEFAULT_LON, DEFAULT_LOCATION_NAME

router = APIRouter(prefix="/api/weather", tags=["Weather Advisory"])

@router.get("", response_model=WeatherResponse)
@router.get("/current", response_model=WeatherResponse)
async def fetch_weather_advisory(
    lat: float = Query(DEFAULT_LAT, description="Latitude"),
    lon: float = Query(DEFAULT_LON, description="Longitude"),
    location: str = Query(DEFAULT_LOCATION_NAME, description="Location display name")
):
    return await get_weather(lat=lat, lon=lon, location_name=location)

@router.get("/alerts")
async def fetch_weather_alerts(
    lat: float = Query(DEFAULT_LAT),
    lon: float = Query(DEFAULT_LON)
):
    w = await get_weather(lat=lat, lon=lon)
    return {"alerts": w.alerts, "total": len(w.alerts)}
