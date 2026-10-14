import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = DATA_DIR / "models"
SAMPLE_LEAVES_DIR = DATA_DIR / "sample_leaves"
UPLOADS_DIR = BASE_DIR / "uploads"

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(SAMPLE_LEAVES_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Database
DB_PATH = BASE_DIR / "agrismart.db"
DATABASE_URL = f"sqlite:///{DB_PATH.as_posix()}"

# Weather API settings (Open-Meteo is free, highly accurate, requires no API key)
OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast"
DEFAULT_LAT = 17.3850   # Hyderabad / Telangana (Central-South India agricultural belt)
DEFAULT_LON = 78.4867
DEFAULT_LOCATION_NAME = "Hyderabad, Telangana (India)"

# Supported plant disease classes (PlantVillage benchmark alignment)
SUPPORTED_DISEASE_CLASSES = [
    {
        "id": "tomato_early_blight",
        "crop": "Tomato",
        "disease": "Early Blight (Alternaria solani)",
        "is_healthy": False,
        "symptoms": "Dark brown to black spots with concentric rings ('target board' appearance) on older lower leaves. Leaves yellow and die prematurely.",
        "prevention": "Ensure good spacing for air circulation, use drip irrigation to keep foliage dry, rotate crops away from solanaceous species for 2-3 years, remove crop debris.",
        "treatment_organic": "Apply copper-based fungicides or biological controls like Bacillus subtilis / Trichoderma harzianum at early symptoms. Neem oil extract spray.",
        "treatment_chemical": "Chlorothalonil or Mancozeb sprays according to local agricultural university (ICAR/KVK) guidelines.",
        "urgency": "Medium"
    },
    {
        "id": "tomato_late_blight",
        "crop": "Tomato",
        "disease": "Late Blight (Phytophthora infestans)",
        "is_healthy": False,
        "symptoms": "Water-soaked irregular grayish-green lesions that rapidly expand and turn dark brown. White fungal mold visible on leaf undersides under high humidity.",
        "prevention": "Plant certified disease-free transplants, avoid overhead sprinklers, remove and safely destroy infected plants immediately.",
        "treatment_organic": "Fixed copper fungicides preventive spray; bio-fungicide Bacillus amyloliquefaciens.",
        "treatment_chemical": "Metalaxyl + Mancozeb (Ridomil) or Cymoxanil spray as per regional agricultural extension advice.",
        "urgency": "High"
    },
    {
        "id": "tomato_healthy",
        "crop": "Tomato",
        "disease": "Healthy Tomato Foliage",
        "is_healthy": True,
        "symptoms": "Vibrant green leaves, uniform coloration, no necrotic lesions or abnormal spotting.",
        "prevention": "Maintain balanced NPK fertilization, regular scouting, mulching, and optimal drip irrigation.",
        "treatment_organic": "None required. Maintain bio-fertilizer schedule.",
        "treatment_chemical": "None needed.",
        "urgency": "Low"
    },
    {
        "id": "potato_early_blight",
        "crop": "Potato",
        "disease": "Early Blight (Alternaria solani)",
        "is_healthy": False,
        "symptoms": "Small brown spots on lower leaves enlarging into concentric rings surrounded by a chlorotic yellow halo.",
        "prevention": "Maintain plant vigor with balanced nitrogen; practice 3-year crop rotation; avoid overhead watering.",
        "treatment_organic": "Copper oxychloride or Pseudomonas fluorescens preventive spray.",
        "treatment_chemical": "Mancozeb 75 WP (2 g/L) or Propineb under consultation with local agronomist.",
        "urgency": "Medium"
    },
    {
        "id": "potato_late_blight",
        "crop": "Potato",
        "disease": "Late Blight (Phytophthora infestans)",
        "is_healthy": False,
        "symptoms": "Water-soaked dark lesions that rapidly blacken. White mildew ring on the underside during humid/cool weather.",
        "prevention": "Use certified seed tubers, hill up soil well to protect tubers, monitor weather for cool moist spells.",
        "treatment_organic": "Bordeaux mixture (1%) preventive spray before onset of cold humid weather.",
        "treatment_chemical": "Dimethomorph or Metalaxyl spray strictly following university extension dosage.",
        "urgency": "High"
    },
    {
        "id": "potato_healthy",
        "crop": "Potato",
        "disease": "Healthy Potato Foliage",
        "is_healthy": True,
        "symptoms": "Rich green foliage without chlorosis, spots, or leaf curling.",
        "prevention": "Ensure adequate potassium, balanced irrigation, and periodic field inspections.",
        "treatment_organic": "Maintain healthy organic compost and beneficial soil microbes.",
        "treatment_chemical": "None needed.",
        "urgency": "Low"
    },
    {
        "id": "corn_common_rust",
        "crop": "Corn (Maize)",
        "disease": "Common Rust (Puccinia sorghi)",
        "is_healthy": False,
        "symptoms": "Oval to elongate cinnamon-brown pustules on both upper and lower leaf surfaces. Pustules rupture the epidermis.",
        "prevention": "Plant rust-resistant maize hybrids, early sowing to avoid high-humidity season peaks.",
        "treatment_organic": "Sulfur dusting or neem-based formulations at early stages.",
        "treatment_chemical": "Azoxystrobin or Tebuconazole foliar spray if threshold exceeds economic injury level.",
        "urgency": "Medium"
    },
    {
        "id": "corn_healthy",
        "crop": "Corn (Maize)",
        "disease": "Healthy Corn Foliage",
        "is_healthy": True,
        "symptoms": "Deep green, elongated leaves with clean parallel venation and zero pustules.",
        "prevention": "Balanced NPK application, soil aerating, and clean field boundaries.",
        "treatment_organic": "Maintain organic mulch and regular weeding.",
        "treatment_chemical": "None needed.",
        "urgency": "Low"
    },
    {
        "id": "apple_scab",
        "crop": "Apple",
        "disease": "Apple Scab (Venturia inaequalis)",
        "is_healthy": False,
        "symptoms": "Olive-green to velvety brown or black velvety spots on leaves and fruit, causing premature defoliation.",
        "prevention": "Rake and compost or burn fallen leaves in autumn, prune canopy to maximize sunlight penetration.",
        "treatment_organic": "Lime sulfur or potassium bicarbonate sprays during wet springtime periods.",
        "treatment_chemical": "Captan or Difenoconazole applied during vulnerable green-tip through petal-fall stages.",
        "urgency": "High"
    },
    {
        "id": "apple_healthy",
        "crop": "Apple",
        "disease": "Healthy Apple Foliage",
        "is_healthy": True,
        "symptoms": "Smooth green leaves, sturdy foliage, absence of scab lesions or powdery spots.",
        "prevention": "Proper winter pruning and balanced micronutrient spray.",
        "treatment_organic": "Compost tea and beneficial foliar sprays.",
        "treatment_chemical": "None needed.",
        "urgency": "Low"
    },
    {
        "id": "rice_blast",
        "crop": "Rice",
        "disease": "Rice Blast (Magnaporthe oryzae)",
        "is_healthy": False,
        "symptoms": "Diamond/spindle-shaped lesions with grayish centers and brownish-red borders on leaves; neck rot at flowering.",
        "prevention": "Avoid excessive nitrogen fertilizers; avoid water stress during tillering and flowering stages; clean seed selection.",
        "treatment_organic": "Foliar application of Pseudomonas fluorescens (5 g/L) or garlic-chili extract.",
        "treatment_chemical": "Tricyclazole 75 WP (0.6 g/L) or Isoprothiolane as recommended by state agricultural officers.",
        "urgency": "High"
    },
    {
        "id": "rice_healthy",
        "crop": "Rice",
        "disease": "Healthy Rice Crop",
        "is_healthy": True,
        "symptoms": "Erect, bright emerald green leaves without necrotic lesions or sheath rot.",
        "prevention": "System of Rice Intensification (SRI) water management, balanced NPK + Zinc.",
        "treatment_organic": "Azospirillum and Phosphobacteria bio-fertilizers.",
        "treatment_chemical": "None needed.",
        "urgency": "Low"
    }
]

# Supported crop labels for Crop Recommendation ML
SUPPORTED_CROPS = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas", "mothbeans",
    "mungbean", "blackgram", "lentil", "pomegranate", "banana", "mango",
    "grapes", "watermelon", "muskmelon", "apple", "orange", "papaya",
    "coconut", "cotton", "jute", "coffee"
]
