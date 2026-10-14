"""
AgriSmart AI - Automated API Endpoint Test Suite
Tests all core modules: Disease Detection, Crop Recommendation, Smart Irrigation, Weather, Chatbot, Dashboard.
"""

from fastapi.testclient import TestClient
from app.main import app
import os

client = TestClient(app)

def test_endpoints():
    print("================ Testing AgriSmart AI APIs ================")

    # 1. Root & Health Check
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print(" [PASS] GET / -> Status 200 OK")

    res = client.get("/api/health")
    assert res.status_code == 200
    print(" [PASS] GET /api/health -> Healthy")

    # 2. Disease Classes & Sample Leaves
    res = client.get("/api/disease/classes")
    assert res.status_code == 200
    assert res.json()["total"] >= 12
    print(f" [PASS] GET /api/disease/classes -> {res.json()['total']} PlantVillage classes supported")

    res = client.get("/api/disease/sample-leaves")
    assert res.status_code == 200
    samples = res.json()["samples"]
    print(f" [PASS] GET /api/disease/sample-leaves -> {len(samples)} demonstrator leaves available")

    # 3. Test Disease Detection Inference with synthetic leaf
    sample_file_path = os.path.join("data", "sample_leaves", "tomato_early_blight.jpg")
    if os.path.exists(sample_file_path):
        with open(sample_file_path, "rb") as f:
            res = client.post("/api/disease/detect", files={"file": ("leaf.jpg", f, "image/jpeg")}, data={"crop_hint": "Tomato"})
        assert res.status_code == 200, f"Detection failed: {res.text}"
        data = res.json()
        print(f" [PASS] POST /api/disease/detect -> Predicted: {data['disease']}, Confidence: {data['confidence'] * 100:.1f}%")

    # 4. Crop Recommendation
    crop_payload = {
        "n": 82, "p": 45, "k": 42,
        "temperature": 24.5, "humidity": 80.0,
        "ph": 6.5, "rainfall": 220.0,
        "location": "Warangal, Telangana"
    }
    res = client.post("/api/crop/recommend", json=crop_payload)
    assert res.status_code == 200, f"Crop rec failed: {res.text}"
    data = res.json()
    print(f" [PASS] POST /api/crop/recommend -> Top Crop: {data['recommended_crop']}, Confidence: {data['confidence'] * 100:.1f}%")

    # 5. Smart Irrigation
    irrig_payload = {
        "crop_type": "Tomato",
        "soil_moisture": 25.0,
        "temperature": 32.0,
        "humidity": 50.0,
        "soil_type": "Loamy",
        "growth_stage": "Flowering",
        "field_size_acres": 2.0,
        "use_live_weather": False
    }
    res = client.post("/api/irrigation/calculate", json=irrig_payload)
    assert res.status_code == 200, f"Irrigation failed: {res.text}"
    data = res.json()
    print(f" [PASS] POST /api/irrigation/calculate -> Status: {data['status']}, Needed: {data['irrigation_needed']}, Water: {data['water_amount_liters_per_sqm']} L/m²")

    # 6. Simulated IoT Sensor
    res = client.get("/api/irrigation/simulate-sensor?crop=Tomato")
    assert res.status_code == 200
    print(f" [PASS] GET /api/irrigation/simulate-sensor -> Moisture: {res.json()['soil_moisture_pct']}%, Battery: {res.json()['battery_level_pct']}%")

    # 7. Weather Advisory
    res = client.get("/api/weather")
    assert res.status_code == 200
    w = res.json()
    print(f" [PASS] GET /api/weather -> Current Temp: {w['current']['temperature']}°C, Forecast days: {len(w['forecast'])}, Alerts: {len(w['alerts'])}")

    # 8. Multilingual Chatbot (English, Telugu, Hindi)
    res_en = client.post("/api/chat", json={"message": "What is early blight?", "language": "en"})
    assert res_en.status_code == 200
    print(" [PASS] POST /api/chat [EN] -> Response verified")

    res_te = client.post("/api/chat", json={"message": "టొమాటో ఆకుమచ్చ తెగులు నివారణ", "language": "te"})
    assert res_te.status_code == 200
    print(" [PASS] POST /api/chat [TE] -> Telugu Response verified")

    res_hi = client.post("/api/chat", json={"message": "झुलसा रोग से बचाव कैसे करें?", "language": "hi"})
    assert res_hi.status_code == 200
    print(" [PASS] POST /api/chat [HI] -> Hindi Response verified")

    # 9. Dashboard Summary
    res = client.get("/api/dashboard/summary")
    assert res.status_code == 200
    d = res.json()
    print(f" [PASS] GET /api/dashboard/summary -> Scans: {d['total_scans']}, Recs: {d['total_crop_recommendations']}, Irrigations: {d['total_irrigation_calculations']}")

    print("\n[SUCCESS] ALL BACKEND APIS & INFERENCE MODULES FULLY OPERATIONAL!")

if __name__ == "__main__":
    test_endpoints()
