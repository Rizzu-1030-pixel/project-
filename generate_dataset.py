"""
AgriSmart AI - Crop Recommendation Dataset Generator
Based on ICAR & FAO agronomic benchmark parameters for 22 crops.
Generates 2,200 scientifically distributed samples (100 per crop class).
Uses standard library csv & random (no external dependencies required).
"""

import csv
import random
import os

random.seed(42)

CROP_PROFILES = {
    "rice": {
        "N": (80, 10), "P": (48, 8), "K": (40, 5),
        "temperature": (23.7, 2.5), "humidity": (82.3, 5.0),
        "ph": (6.4, 0.4), "rainfall": (236.0, 30.0)
    },
    "maize": {
        "N": (78, 12), "P": (48, 8), "K": (20, 5),
        "temperature": (22.4, 3.0), "humidity": (65.1, 7.0),
        "ph": (6.2, 0.5), "rainfall": (85.0, 15.0)
    },
    "chickpea": {
        "N": (40, 10), "P": (68, 8), "K": (80, 6),
        "temperature": (18.9, 2.0), "humidity": (16.9, 3.0),
        "ph": (7.3, 0.4), "rainfall": (80.1, 10.0)
    },
    "kidneybeans": {
        "N": (20, 8), "P": (67, 8), "K": (20, 4),
        "temperature": (20.1, 2.5), "humidity": (21.6, 4.0),
        "ph": (5.7, 0.3), "rainfall": (105.9, 15.0)
    },
    "pigeonpeas": {
        "N": (20, 6), "P": (68, 7), "K": (20, 4),
        "temperature": (27.7, 3.0), "humidity": (48.1, 7.0),
        "ph": (5.8, 0.6), "rainfall": (149.5, 25.0)
    },
    "mothbeans": {
        "N": (21, 6), "P": (48, 8), "K": (20, 5),
        "temperature": (28.2, 2.8), "humidity": (53.2, 8.0),
        "ph": (6.8, 0.7), "rainfall": (51.2, 10.0)
    },
    "mungbean": {
        "N": (21, 6), "P": (47, 7), "K": (20, 5),
        "temperature": (28.5, 2.0), "humidity": (85.5, 4.0),
        "ph": (6.7, 0.4), "rainfall": (48.4, 8.0)
    },
    "blackgram": {
        "N": (40, 8), "P": (67, 8), "K": (19, 4),
        "temperature": (30.0, 2.5), "humidity": (65.1, 6.0),
        "ph": (7.1, 0.4), "rainfall": (67.9, 10.0)
    },
    "lentil": {
        "N": (18, 5), "P": (68, 8), "K": (19, 4),
        "temperature": (24.5, 3.0), "humidity": (64.8, 7.0),
        "ph": (6.9, 0.6), "rainfall": (45.7, 8.0)
    },
    "pomegranate": {
        "N": (19, 5), "P": (19, 4), "K": (40, 6),
        "temperature": (21.8, 3.2), "humidity": (90.1, 4.0),
        "ph": (6.4, 0.5), "rainfall": (107.5, 12.0)
    },
    "banana": {
        "N": (100, 10), "P": (82, 7), "K": (50, 5),
        "temperature": (27.4, 2.0), "humidity": (80.4, 4.0),
        "ph": (6.0, 0.4), "rainfall": (104.6, 12.0)
    },
    "mango": {
        "N": (20, 5), "P": (27, 5), "K": (30, 5),
        "temperature": (31.2, 2.5), "humidity": (50.2, 5.0),
        "ph": (5.8, 0.6), "rainfall": (94.7, 10.0)
    },
    "grapes": {
        "N": (23, 6), "P": (132, 10), "K": (200, 8),
        "temperature": (23.8, 5.0), "humidity": (81.9, 3.0),
        "ph": (6.0, 0.5), "rainfall": (69.6, 8.0)
    },
    "watermelon": {
        "N": (99, 10), "P": (17, 4), "K": (50, 5),
        "temperature": (25.6, 2.0), "humidity": (85.2, 4.0),
        "ph": (6.5, 0.3), "rainfall": (50.8, 6.0)
    },
    "muskmelon": {
        "N": (100, 10), "P": (18, 4), "K": (50, 5),
        "temperature": (28.6, 2.0), "humidity": (92.3, 3.0),
        "ph": (6.4, 0.3), "rainfall": (24.7, 4.0)
    },
    "apple": {
        "N": (21, 6), "P": (134, 10), "K": (200, 8),
        "temperature": (22.6, 3.5), "humidity": (92.3, 4.0),
        "ph": (5.9, 0.4), "rainfall": (112.7, 12.0)
    },
    "orange": {
        "N": (20, 5), "P": (16, 4), "K": (10, 3),
        "temperature": (22.8, 4.0), "humidity": (92.2, 3.0),
        "ph": (7.0, 0.5), "rainfall": (110.4, 10.0)
    },
    "papaya": {
        "N": (50, 8), "P": (59, 7), "K": (50, 5),
        "temperature": (33.7, 3.0), "humidity": (92.4, 4.0),
        "ph": (6.7, 0.4), "rainfall": (142.6, 20.0)
    },
    "coconut": {
        "N": (22, 6), "P": (17, 4), "K": (30, 5),
        "temperature": (27.4, 2.0), "humidity": (94.8, 3.0),
        "ph": (6.0, 0.4), "rainfall": (175.7, 25.0)
    },
    "cotton": {
        "N": (118, 12), "P": (46, 8), "K": (20, 4),
        "temperature": (24.0, 2.0), "humidity": (79.8, 4.0),
        "ph": (6.9, 0.5), "rainfall": (80.4, 12.0)
    },
    "jute": {
        "N": (78, 10), "P": (47, 7), "K": (40, 5),
        "temperature": (25.0, 2.0), "humidity": (79.6, 4.0),
        "ph": (6.7, 0.4), "rainfall": (174.8, 20.0)
    },
    "coffee": {
        "N": (101, 10), "P": (29, 6), "K": (30, 5),
        "temperature": (25.5, 2.5), "humidity": (58.9, 7.0),
        "ph": (6.8, 0.5), "rainfall": (158.1, 20.0)
    }
}

def generate_crop_dataset(samples_per_crop=100, output_file="data/crop_recommendation.csv"):
    rows = []
    fieldnames = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall", "label"]

    for crop, prof in CROP_PROFILES.items():
        for _ in range(samples_per_crop):
            n = max(0, int(random.gauss(prof["N"][0], prof["N"][1])))
            p = max(5, int(random.gauss(prof["P"][0], prof["P"][1])))
            k = max(5, int(random.gauss(prof["K"][0], prof["K"][1])))
            temp = round(max(8.0, random.gauss(prof["temperature"][0], prof["temperature"][1])), 2)
            hum = round(min(100.0, max(10.0, random.gauss(prof["humidity"][0], prof["humidity"][1]))), 2)
            ph = round(min(10.0, max(3.5, random.gauss(prof["ph"][0], prof["ph"][1]))), 2)
            rain = round(max(15.0, random.gauss(prof["rainfall"][0], prof["rainfall"][1])), 2)
            rows.append({
                "N": n, "P": p, "K": k,
                "temperature": temp, "humidity": hum,
                "ph": ph, "rainfall": rain,
                "label": crop
            })

    random.shuffle(rows)
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Successfully generated {len(rows)} samples across {len(CROP_PROFILES)} crops -> {output_file}")

if __name__ == "__main__":
    generate_crop_dataset()
