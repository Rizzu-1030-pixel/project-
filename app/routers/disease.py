import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..config import SUPPORTED_DISEASE_CLASSES, UPLOADS_DIR, SAMPLE_LEAVES_DIR
from ..models.schemas import DiseaseDetectionResponse, DiseaseScanRecord
from ..services.disease_classifier import predict_disease, generate_sample_leaf_images

router = APIRouter(prefix="/api/disease", tags=["Disease Detection"])

@router.on_event("startup")
def setup_samples():
    generate_sample_leaf_images()

@router.post("/detect", response_model=DiseaseDetectionResponse)
async def detect_crop_disease(
    file: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        # Save uploaded image locally
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOADS_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(content)
            
        result = predict_disease(content, crop_hint=crop_hint)
        
        # Save record to database
        record = DiseaseScanRecord(
            image_filename=filename,
            crop_name=result.crop,
            predicted_disease=result.disease,
            confidence=result.confidence,
            is_healthy=result.is_healthy,
            is_uncertain=result.is_uncertain,
            symptoms=result.symptoms,
            preventive_measures=result.prevention,
            treatment_organic=result.treatment_organic,
            treatment_chemical=result.treatment_chemical,
            urgency=result.urgency,
            leaf_verified=result.leaf_verified
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
        result.id = record.id
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnostic pipeline error: {str(e)}")

@router.get("/classes")
def get_supported_classes():
    return {"total": len(SUPPORTED_DISEASE_CLASSES), "classes": SUPPORTED_DISEASE_CLASSES}

@router.get("/sample-leaves")
def get_sample_leaves():
    """Returns sample test leaves generated for instant evaluation without requiring real camera uploads."""
    samples = []
    if os.path.exists(SAMPLE_LEAVES_DIR):
        for f in os.listdir(SAMPLE_LEAVES_DIR):
            if f.endswith((".jpg", ".png", ".jpeg")):
                name_clean = f.replace(".jpg", "").replace("_", " ").title()
                samples.append({
                    "filename": f,
                    "title": name_clean,
                    "url": f"/static/sample_leaves/{f}"
                })
    return {"samples": samples}

@router.get("/history")
def get_scan_history(limit: int = 15, db: Session = Depends(get_db)):
    scans = db.query(DiseaseScanRecord).order_by(DiseaseScanRecord.timestamp.desc()).limit(limit).all()
    return scans
