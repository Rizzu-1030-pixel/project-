import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import UPLOADS_DIR, SAMPLE_LEAVES_DIR
from .database import init_db
from .routers import disease, crop, irrigation, weather, chatbot, dashboard
from .services.disease_classifier import generate_sample_leaf_images

app = FastAPI(
    title="AgriSmart AI – Smart Agriculture & Crop Health Assistant",
    description="Full-stack AI assistant for crop disease detection, smart irrigation, crop recommendation, weather advisories, and multilingual guidance.",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schema and generate sample leaves immediately
init_db()
generate_sample_leaf_images()

# Mount static directories for uploaded images and sample leaf test images
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(SAMPLE_LEAVES_DIR, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/static/sample_leaves", StaticFiles(directory=str(SAMPLE_LEAVES_DIR)), name="sample_leaves")

# Include Routers
app.include_router(disease.router)
app.include_router(crop.router)
app.include_router(irrigation.router)
app.include_router(weather.router)
app.include_router(chatbot.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {
        "project": "AgriSmart AI",
        "description": "Smart Agriculture and Crop Health Assistant API",
        "version": "1.0.0",
        "docs_url": "/docs",
        "status": "Operational"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "AgriSmart AI Backend"}
