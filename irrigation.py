from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schemas import IrrigationRequest, IrrigationResponse, IrrigationLogRecord
from ..services.irrigation_advisor import calculate_irrigation, simulate_iot_sensor
from ..services.weather_service import get_weather

router = APIRouter(prefix="/api/irrigation", tags=["Smart Irrigation"])

@router.post("/calculate", response_model=IrrigationResponse)
async def compute_irrigation(req: IrrigationRequest, db: Session = Depends(get_db)):
    try:
        forecast_rain = 0.0
        if req.use_live_weather:
            try:
                weather_data = await get_weather(lat=req.latitude or 17.3850, lon=req.longitude or 78.4867)
                if weather_data.forecast and len(weather_data.forecast) > 0:
                    # Sum precipitation of today and tomorrow
                    forecast_rain = sum(d.precipitation_sum for d in weather_data.forecast[:2])
            except Exception as we:
                print(f"Weather lookup note: {we}")

        res = calculate_irrigation(req, forecast_rain_24h=forecast_rain)

        # Log into database
        log_record = IrrigationLogRecord(
            crop_type=res.crop_type,
            soil_moisture=req.soil_moisture,
            temperature=req.temperature or 28.0,
            humidity=req.humidity or 65.0,
            rainfall_forecast_mm=forecast_rain,
            irrigation_needed=res.irrigation_needed,
            water_amount_liters_per_sqm=res.water_amount_liters_per_sqm,
            urgency=res.urgency,
            advice=res.weather_impact,
            is_simulated=False
        )
        db.add(log_record)
        db.commit()
        db.refresh(log_record)

        res.id = log_record.id
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Irrigation calculation error: {str(e)}")

@router.get("/simulate-sensor")
def get_sensor_telemetry(crop: str = "Tomato"):
    """Provides simulated IoT sensor telemetry for testing when physical sensors are not available."""
    return simulate_iot_sensor(crop_type=crop)

@router.get("/history")
def get_irrigation_history(limit: int = 15, db: Session = Depends(get_db)):
    logs = db.query(IrrigationLogRecord).order_by(IrrigationLogRecord.timestamp.desc()).limit(limit).all()
    return logs
