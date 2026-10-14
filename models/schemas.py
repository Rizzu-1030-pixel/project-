from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from ..database import Base

# ================= SQLAlchemy ORM Models =================

class DiseaseScanRecord(Base):
    __tablename__ = "disease_scans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    image_filename = Column(String(255), nullable=True)
    crop_name = Column(String(100))
    predicted_disease = Column(String(150))
    confidence = Column(Float)
    is_healthy = Column(Boolean, default=False)
    is_uncertain = Column(Boolean, default=False)
    symptoms = Column(Text, nullable=True)
    preventive_measures = Column(Text, nullable=True)
    treatment_organic = Column(Text, nullable=True)
    treatment_chemical = Column(Text, nullable=True)
    urgency = Column(String(50), default="Medium")
    leaf_verified = Column(Boolean, default=True)


class CropRecommendationRecord(Base):
    __tablename__ = "crop_recommendations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    n = Column(Float)
    p = Column(Float)
    k = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    ph = Column(Float)
    rainfall = Column(Float)
    location = Column(String(200), nullable=True)
    recommended_crop = Column(String(100))
    confidence = Column(Float)
    explanation = Column(Text)
    alternatives = Column(JSON, nullable=True)


class IrrigationLogRecord(Base):
    __tablename__ = "irrigation_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    crop_type = Column(String(100))
    soil_moisture = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall_forecast_mm = Column(Float, default=0.0)
    irrigation_needed = Column(Boolean)
    water_amount_liters_per_sqm = Column(Float, default=0.0)
    urgency = Column(String(50))
    advice = Column(Text)
    is_simulated = Column(Boolean, default=False)


# ================= Pydantic Schemas =================

# Disease Detection
class DiseaseDetectionResponse(BaseModel):
    id: Optional[int] = None
    crop: str
    disease: str
    confidence: float
    is_healthy: bool
    is_uncertain: bool
    uncertainty_reason: Optional[str] = None
    symptoms: str
    prevention: str
    treatment_organic: str
    treatment_chemical: str
    urgency: str
    leaf_verified: bool
    top_predictions: Optional[List[Dict[str, Any]]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


# Crop Recommendation
class CropRecommendationRequest(BaseModel):
    n: float = Field(..., ge=0, le=200, description="Nitrogen content in soil (kg/ha)")
    p: float = Field(..., ge=0, le=200, description="Phosphorus content in soil (kg/ha)")
    k: float = Field(..., ge=0, le=300, description="Potassium content in soil (kg/ha)")
    temperature: float = Field(..., ge=-10, le=60, description="Average temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity %")
    ph: float = Field(..., ge=0, le=14, description="Soil pH level")
    rainfall: float = Field(..., ge=0, le=1000, description="Expected seasonal rainfall (mm)")
    location: Optional[str] = Field("Telangana, India", description="Farmer location")


class CropRecommendationResponse(BaseModel):
    id: Optional[int] = None
    recommended_crop: str
    confidence: float
    explanation: str
    soil_suitability: Dict[str, Any]
    climate_suitability: Dict[str, Any]
    alternatives: List[Dict[str, Any]]
    ideal_growing_conditions: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


# Smart Irrigation
class IrrigationRequest(BaseModel):
    crop_type: str = Field(..., description="E.g., Rice, Tomato, Maize, Potato, Cotton")
    soil_moisture: float = Field(..., ge=0, le=100, description="Current soil moisture percentage")
    temperature: Optional[float] = Field(None, description="Current temperature (defaults to live weather if empty)")
    humidity: Optional[float] = Field(None, description="Current humidity %")
    soil_type: Optional[str] = Field("Loamy", description="Clay, Sandy, Loamy, Silt")
    growth_stage: Optional[str] = Field("Vegetative", description="Initial, Vegetative, Flowering, Yield Formation, Ripening")
    field_size_acres: Optional[float] = Field(1.0, ge=0.1, le=500.0)
    use_live_weather: Optional[bool] = Field(True, description="Whether to incorporate live 48h rain forecast")
    latitude: Optional[float] = Field(17.3850)
    longitude: Optional[float] = Field(78.4867)


class IrrigationResponse(BaseModel):
    id: Optional[int] = None
    crop_type: str
    irrigation_needed: bool
    status: str
    urgency: str
    water_amount_liters_per_sqm: float
    total_water_liters: float
    soil_moisture_level: str
    weather_impact: str
    water_saving_tips: List[str]
    irrigation_schedule: List[Dict[str, Any]]
    simulated: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True


# Weather
class WeatherCurrent(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    precipitation: float
    weather_code: int
    weather_desc: str
    is_day: bool


class WeatherForecastDay(BaseModel):
    date: str
    day_name: str
    temp_max: float
    temp_min: float
    precipitation_sum: float
    precipitation_probability: Optional[float] = 0
    weather_code: int
    weather_desc: str
    farming_advisory: str


class WeatherAlert(BaseModel):
    severity: str  # Warning, Watch, Advisory
    title: str
    description: str
    farming_precaution: str
    affected_crops: List[str]


class WeatherResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    current: WeatherCurrent
    forecast: List[WeatherForecastDay]
    alerts: List[WeatherAlert]
    agricultural_summary: str


# Chatbot
class ChatRequest(BaseModel):
    message: str
    language: str = Field("en", description="en (English), te (Telugu), hi (Hindi)")
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    response: str
    language: str
    confidence: str
    caution_notice: Optional[str] = None
    suggested_followups: List[str]
    source: str = "AgriSmart Verified Agronomic Knowledge Engine"


# Dashboard Summary
class DashboardSummaryResponse(BaseModel):
    total_scans: int
    healthy_scans: int
    diseased_scans: int
    total_crop_recommendations: int
    total_irrigation_calculations: int
    recent_scans: List[Dict[str, Any]]
    active_alerts: List[WeatherAlert]
    current_weather: Optional[WeatherCurrent] = None
    soil_health_trend: List[Dict[str, Any]]
