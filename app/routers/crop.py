from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schemas import CropRecommendationRequest, CropRecommendationResponse, CropRecommendationRecord
from ..services.crop_recommender import recommend_crop, CROP_AGRONOMIC_PROFILES

router = APIRouter(prefix="/api/crop", tags=["Crop Recommendation"])

@router.post("/recommend", response_model=CropRecommendationResponse)
def get_crop_recommendation(req: CropRecommendationRequest, db: Session = Depends(get_db)):
    try:
        rec = recommend_crop(
            n=req.n,
            p=req.p,
            k=req.k,
            temp=req.temperature,
            hum=req.humidity,
            ph=req.ph,
            rain=req.rainfall,
            location=req.location or "Telangana, India"
        )
        
        # Save record to database
        record = CropRecommendationRecord(
            n=req.n,
            p=req.p,
            k=req.k,
            temperature=req.temperature,
            humidity=req.humidity,
            ph=req.ph,
            rainfall=req.rainfall,
            location=req.location,
            recommended_crop=rec.recommended_crop,
            confidence=rec.confidence,
            explanation=rec.explanation,
            alternatives=rec.alternatives
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
        rec.id = record.id
        return rec
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop recommendation failure: {str(e)}")

@router.get("/history")
def get_recommendation_history(limit: int = 15, db: Session = Depends(get_db)):
    recs = db.query(CropRecommendationRecord).order_by(CropRecommendationRecord.timestamp.desc()).limit(limit).all()
    return recs

@router.get("/benchmark-crops")
def get_benchmark_crops():
    crops = []
    for k, v in CROP_AGRONOMIC_PROFILES.items():
        crops.append({
            "id": k,
            "display_name": v["display_name"],
            "season": v["season"],
            "soil_type": v["soil_type"],
            "advice": v["advice"]
        })
    return {"total": len(crops), "crops": crops}
