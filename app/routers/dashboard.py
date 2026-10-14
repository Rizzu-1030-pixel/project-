from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schemas import DashboardSummaryResponse, DiseaseScanRecord, CropRecommendationRecord, IrrigationLogRecord
from ..services.weather_service import get_weather

router = APIRouter(prefix="/api/dashboard", tags=["Farmer Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
async def get_dashboard_summary(db: Session = Depends(get_db)):
    total_scans = db.query(DiseaseScanRecord).count()
    healthy_scans = db.query(DiseaseScanRecord).filter(DiseaseScanRecord.is_healthy == True).count()
    diseased_scans = total_scans - healthy_scans
    total_recs = db.query(CropRecommendationRecord).count()
    total_irrig = db.query(IrrigationLogRecord).count()

    recent_scans_raw = db.query(DiseaseScanRecord).order_by(DiseaseScanRecord.timestamp.desc()).limit(5).all()
    recent_scans = []
    for s in recent_scans_raw:
        recent_scans.append({
            "id": s.id,
            "crop": s.crop_name,
            "disease": s.predicted_disease,
            "confidence": s.confidence,
            "is_healthy": s.is_healthy,
            "urgency": s.urgency,
            "timestamp": s.timestamp.strftime("%Y-%m-%d %H:%M") if s.timestamp else ""
        })

    # Fetch live weather alerts
    weather_res = await get_weather()

    # Soil health trend mock for dashboard chart widget
    soil_health_trend = [
        {"month": "May", "ph": 6.8, "nitrogen": 72, "moisture": 42},
        {"month": "Jun", "ph": 6.7, "nitrogen": 78, "moisture": 55},
        {"month": "Jul", "ph": 6.5, "nitrogen": 85, "moisture": 68},
        {"month": "Aug", "ph": 6.6, "nitrogen": 80, "moisture": 62},
        {"month": "Sep", "ph": 6.7, "nitrogen": 75, "moisture": 50},
        {"month": "Oct", "ph": 6.8, "nitrogen": 79, "moisture": 45}
    ]

    return DashboardSummaryResponse(
        total_scans=total_scans,
        healthy_scans=healthy_scans,
        diseased_scans=diseased_scans,
        total_crop_recommendations=total_recs,
        total_irrigation_calculations=total_irrig,
        recent_scans=recent_scans,
        active_alerts=weather_res.alerts,
        current_weather=weather_res.current,
        soil_health_trend=soil_health_trend
    )
