import random
from typing import Dict, Any, List
from ..models.schemas import IrrigationRequest, IrrigationResponse

# FAO-56 Crop Coefficients (Kc) by Growth Stage
CROP_KC = {
    "rice": {"Initial": 1.05, "Vegetative": 1.10, "Flowering": 1.20, "Yield Formation": 1.15, "Ripening": 0.95},
    "tomato": {"Initial": 0.60, "Vegetative": 0.85, "Flowering": 1.15, "Yield Formation": 1.05, "Ripening": 0.70},
    "maize": {"Initial": 0.40, "Vegetative": 0.80, "Flowering": 1.20, "Yield Formation": 1.10, "Ripening": 0.60},
    "potato": {"Initial": 0.50, "Vegetative": 0.75, "Flowering": 1.15, "Yield Formation": 1.05, "Ripening": 0.75},
    "cotton": {"Initial": 0.45, "Vegetative": 0.75, "Flowering": 1.20, "Yield Formation": 1.00, "Ripening": 0.65},
    "banana": {"Initial": 1.00, "Vegetative": 1.10, "Flowering": 1.20, "Yield Formation": 1.15, "Ripening": 1.00},
    "apple": {"Initial": 0.50, "Vegetative": 0.85, "Flowering": 1.05, "Yield Formation": 1.00, "Ripening": 0.75},
    "wheat": {"Initial": 0.40, "Vegetative": 0.70, "Flowering": 1.15, "Yield Formation": 1.05, "Ripening": 0.40},
}

# Soil Field Capacity and Wilting Points (%)
SOIL_MOISTURE_THRESHOLDS = {
    "Clay": {"wilting_point": 24, "threshold": 45, "field_capacity": 55, "waterlogged": 80},
    "Sandy": {"wilting_point": 10, "threshold": 25, "field_capacity": 35, "waterlogged": 65},
    "Loamy": {"wilting_point": 15, "threshold": 35, "field_capacity": 45, "waterlogged": 75},
    "Silt": {"wilting_point": 18, "threshold": 38, "field_capacity": 48, "waterlogged": 78}
}

WATER_SAVING_TIPS = [
    "Drip Irrigation Advantage: Switching from flood irrigation to drip can reduce water consumption by 40-50% while decreasing fungal foliar disease.",
    "Timing Optimization: Irrigate between 5:00 AM - 8:00 AM or after 6:00 PM to cut evaporation loss by up to 25%.",
    "Organic Mulching: Applying a 3-inch layer of straw, dry leaves, or crop residue retains root zone moisture and suppresses weed competition.",
    "Rainwater Harvesting: Direct field runoff into recharge pits or farm ponds for critical supplemental dry-spell irrigation.",
    "Tensiometer / Sensor Scouting: Irrigate strictly based on soil matric suction rather than calendar intervals."
]

def calculate_irrigation(req: IrrigationRequest, forecast_rain_24h: float = 0.0) -> IrrigationResponse:
    crop_key = req.crop_type.lower().split()[0]
    kc_dict = CROP_KC.get(crop_key, {"Initial": 0.5, "Vegetative": 0.8, "Flowering": 1.1, "Yield Formation": 1.0, "Ripening": 0.7})
    stage = req.growth_stage if req.growth_stage in kc_dict else "Vegetative"
    kc = kc_dict[stage]

    soil_type = req.soil_type if req.soil_type in SOIL_MOISTURE_THRESHOLDS else "Loamy"
    soil_spec = SOIL_MOISTURE_THRESHOLDS[soil_type]

    temp = req.temperature if req.temperature is not None else 28.0
    hum = req.humidity if req.humidity is not None else 65.0
    rain_forecast = forecast_rain_24h if req.use_live_weather else 0.0

    # Evapotranspiration approximation (mm/day)
    # Higher temp and lower humidity drive up ET0
    vapor_pressure_deficit = max(0.5, (100.0 - hum) / 25.0)
    et0 = max(2.5, min(9.0, (temp * 0.12) + (vapor_pressure_deficit * 0.8)))
    etc = et0 * kc  # Crop evapotranspiration rate in mm/day

    current_sm = req.soil_moisture
    wilting = soil_spec["wilting_point"]
    thresh = soil_spec["threshold"]
    fc = soil_spec["field_capacity"]
    waterlogged = soil_spec["waterlogged"]

    irrigation_needed = False
    status = "Optimal"
    urgency = "None"
    water_liters_per_sqm = 0.0
    moisture_level = "Normal"
    weather_impact = "No adverse weather impact."

    if current_sm >= waterlogged:
        status = "Waterlogged / Excessive Moisture"
        urgency = "Caution"
        irrigation_needed = False
        moisture_level = "Excessive"
        weather_impact = "Field is near saturation. Stop irrigation and open drainage channels to prevent root rot."
    elif current_sm < wilting:
        status = "Critical Moisture Deficit (Crop Wilting)"
        urgency = "High"
        irrigation_needed = True
        moisture_level = "Critically Low"
        # Water needed to bring soil back to 80% field capacity
        deficit_pct = max(5.0, fc - current_sm)
        water_liters_per_sqm = round((deficit_pct * 0.45) + (etc * 1.0), 1)
    elif current_sm < thresh:
        status = "Sub-optimal Moisture"
        urgency = "Medium"
        irrigation_needed = True
        moisture_level = "Low"
        deficit_pct = max(3.0, fc - current_sm)
        water_liters_per_sqm = round((deficit_pct * 0.35) + (etc * 0.8), 1)
    else:
        status = "Adequate Root Zone Moisture"
        urgency = "Low"
        irrigation_needed = False
        moisture_level = "Optimal"

    # Check incoming weather impact: if heavy rain is coming, cancel or postpone irrigation!
    if rain_forecast >= 15.0:
        if irrigation_needed and current_sm > wilting:
            irrigation_needed = False
            urgency = "Postponed"
            status = "Postponed Due to Incoming Rain"
            weather_impact = (
                f"Rain forecast predicts {rain_forecast:.1f} mm within 24-48 hours. "
                f"Irrigation should be postponed to avoid waterlogging and conserve pump power."
            )
            water_liters_per_sqm = 0.0
        elif irrigation_needed and current_sm <= wilting:
            water_liters_per_sqm = round(water_liters_per_sqm * 0.4, 1)
            weather_impact = f"Light survival irrigation recommended. Major moisture will arrive with {rain_forecast:.1f} mm forecasted rain."
    elif rain_forecast >= 5.0:
        weather_impact = f"Light showers ({rain_forecast:.1f} mm) expected. Water volume adjusted downwards."
        water_liters_per_sqm = max(0.0, round(water_liters_per_sqm - (rain_forecast * 0.5), 1))

    # Total field calculation (1 acre = 4046.86 m2)
    field_sqm = (req.field_size_acres or 1.0) * 4046.86
    total_water_liters = round(water_liters_per_sqm * field_sqm, 0)

    # 3-day projected schedule
    schedule = [
        {"day": "Today", "action": "Irrigate" if irrigation_needed else "No Irrigation", "volume_liters_sqm": water_liters_per_sqm, "timing": "5:30 AM - 7:30 AM or 6:00 PM"},
        {"day": "Tomorrow", "action": "Scout Moisture", "volume_liters_sqm": 0.0 if not irrigation_needed else round(water_liters_per_sqm * 0.3, 1), "timing": "Early Morning"},
        {"day": "Day 3", "action": "Check Rain Gauge", "volume_liters_sqm": 0.0, "timing": "Evening"}
    ]

    return IrrigationResponse(
        crop_type=req.crop_type,
        irrigation_needed=irrigation_needed,
        status=status,
        urgency=urgency,
        water_amount_liters_per_sqm=water_liters_per_sqm,
        total_water_liters=total_water_liters,
        soil_moisture_level=moisture_level,
        weather_impact=weather_impact,
        water_saving_tips=WATER_SAVING_TIPS[:3],
        irrigation_schedule=schedule,
        simulated=False
    )


def simulate_iot_sensor(crop_type: str = "Tomato") -> Dict[str, Any]:
    """Generates realistic IoT telemetry for demonstration mode when physical sensors are absent."""
    base_moisture = random.uniform(28.0, 58.0)
    return {
        "sensor_id": f"AGRI-NODE-{random.randint(101, 109)}",
        "crop_type": crop_type,
        "soil_moisture_pct": round(base_moisture, 1),
        "soil_temperature_c": round(random.uniform(22.0, 29.5), 1),
        "electrical_conductivity_ds_m": round(random.uniform(0.8, 1.8), 2),
        "battery_level_pct": random.randint(85, 99),
        "signal_strength_dbm": random.randint(-75, -55),
        "status": "Online (Simulated Hardware Node)",
        "last_sync": "Just now"
    }
