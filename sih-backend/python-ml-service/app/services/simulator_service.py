import re
from datetime import datetime
import pandas as pd
from app.core.model_loader import model_store

# Feature column names MUST match exactly what the models were trained with
RESERVE_FEATURE_COLUMNS = [
    "Latitude", "Longitude", "Depth_m", "Surface_NDVI", "Surface_NDWI",
    "Slope_Deg", "Fracture_Density", "Rock_Hardness", "Distance_to_Fault_m",
    "Fe_Content", "SiO2_Content"
]

SHORTFALL_FEATURE_COLUMNS = [
    "Pit_Code", "Rainfall_mm", "Water_Logging_Hours", "Active_Dumpers",
    "Active_Excavators", "Equipment_Availability", "Blasting_Delay_Flag",
    "Haul_Distance_km", "Shift_Efficiency"
]


class SimulatorService:
    @staticmethod
    def predict(
        location_name: str,
        latitude: float,
        longitude: float,
        target_quota: float,
        rainfall: float,
        soil_moisture: float,
        equipment_downtime: float,
        ndvi: float,
        rock_hardness: any
    ) -> dict:
        target_quota = max(1.0, float(target_quota or 40000))
        rainfall = max(0.0, float(rainfall or 85))
        soil_moisture = max(0.0, float(soil_moisture or 62))
        equipment_downtime = max(0.0, float(equipment_downtime or 16))
        ndvi = max(0.0, min(1.0, float(ndvi or 0.38)))

        # Extract numeric rock hardness value
        rh_val = 6.0
        if isinstance(rock_hardness, str):
            match = re.search(r'\d+', rock_hardness)
            if match:
                rh_val = float(match.group(0))
        elif isinstance(rock_hardness, (int, float)):
            rh_val = float(rock_hardness)

        # ─────────────────────────────────────────────────────────────
        # 1. ML Model Inference using named DataFrames (suppresses warnings)
        # ─────────────────────────────────────────────────────────────

        reserve_grade_prediction = None
        if model_store.reserve_model is not None:
            try:
                res_df = pd.DataFrame([[
                    latitude, longitude, 30.0, ndvi, 0.1,
                    10.0, 5.0, rh_val * 10.0, 10.0, 10.0, 45.0
                ]], columns=RESERVE_FEATURE_COLUMNS)
                reserve_grade_prediction = float(
                    model_store.reserve_model.predict(res_df)[0]
                )
            except Exception as e:
                print(f"[SimulatorService] Reserve model warning: {e}")

        shortfall_proba = None
        if model_store.shortfall_model is not None:
            try:
                equipment_availability = max(0.1, 1.0 - (equipment_downtime / 48.0))
                blasting_flag = 1 if equipment_downtime > 12 else 0

                sf_df = pd.DataFrame([[
                    0,                          # Pit_Code (0 = Pit-1_East)
                    rainfall,                   # Rainfall_mm
                    equipment_downtime * 0.5,   # Water_Logging_Hours (estimated)
                    12,                         # Active_Dumpers (typical)
                    4,                          # Active_Excavators (typical)
                    equipment_availability,     # Equipment_Availability
                    blasting_flag,              # Blasting_Delay_Flag
                    2.5,                        # Haul_Distance_km (typical)
                    0.85                        # Shift_Efficiency (typical)
                ]], columns=SHORTFALL_FEATURE_COLUMNS)

                if hasattr(model_store.shortfall_model, 'predict_proba'):
                    shortfall_proba = float(
                        model_store.shortfall_model.predict_proba(sf_df)[0][1]
                    )
            except Exception as e:
                print(f"[SimulatorService] Shortfall model warning: {e}")

        # ─────────────────────────────────────────────────────────────
        # 2. Feature Importance & Penalty/Boost Computation
        # ─────────────────────────────────────────────────────────────
        downtime_penalty = min(95, max(5, round((equipment_downtime / 16.0) * 55)))
        moisture_penalty = min(60, max(4, round((soil_moisture / 62.0) * 16)))
        rainfall_penalty = min(70, max(5, round((rainfall / 85.0) * 21)))
        ndvi_boost = min(40, max(2, round((ndvi / 0.38) * 15)))
        rock_hardness_factor = (rh_val - 6.0) * 2.5

        calculated_reduction_pct = (
            (downtime_penalty * 0.45) +
            (rainfall_penalty * 0.25) +
            (moisture_penalty * 0.20) +
            rock_hardness_factor -
            (ndvi_boost * 0.1133)
        )

        # Blend in trained shortfall model probability (30% weight)
        if shortfall_proba is not None:
            calculated_reduction_pct = (
                (calculated_reduction_pct * 0.7) +
                (shortfall_proba * 100 * 0.3)
            )

        shortfall_pct = round(max(2.0, min(85.0, calculated_reduction_pct)), 1)
        predicted_production = round(target_quota * (1.0 - (shortfall_pct / 100.0)))
        shortfall_tons = max(0, target_quota - predicted_production)

        # ─────────────────────────────────────────────────────────────
        # 3. Shortfall Risk Classification
        # ─────────────────────────────────────────────────────────────
        if shortfall_pct >= 28.0:
            shortfall_risk = "HIGH"
        elif shortfall_pct >= 14.0:
            shortfall_risk = "MEDIUM"
        else:
            shortfall_risk = "LOW"

        # ─────────────────────────────────────────────────────────────
        # 4. Reserve Score (blend with RF grade prediction if available)
        # ─────────────────────────────────────────────────────────────
        base_reserve_score = round(100.0 - (shortfall_pct * 0.73))
        if reserve_grade_prediction is not None:
            grade_adj = (reserve_grade_prediction - 25.0) * 0.4
            base_reserve_score = round(base_reserve_score + grade_adj)

        reserve_score = max(35, min(98, base_reserve_score))

        if reserve_score < 60:
            reserve_confidence = "LOW Confidence"
        elif reserve_score < 75:
            reserve_confidence = "MODERATE Confidence"
        else:
            reserve_confidence = "HIGH Confidence"

        # ─────────────────────────────────────────────────────────────
        # 5. Feature Importance Array
        # ─────────────────────────────────────────────────────────────
        feature_importance = [
            {
                "name": "Equipment Downtime",
                "impactType": "penalty",
                "value": -float(downtime_penalty),
                "display": f"-{downtime_penalty}% penalty",
                "progress": float(downtime_penalty),
                "color": "danger",
            },
            {
                "name": "Soil Saturation & Moisture",
                "impactType": "penalty",
                "value": -float(moisture_penalty),
                "display": f"-{moisture_penalty}% penalty",
                "progress": float(moisture_penalty),
                "color": "danger",
            },
            {
                "name": "Monsoon Rainfall",
                "impactType": "penalty",
                "value": -float(rainfall_penalty),
                "display": f"-{rainfall_penalty}% penalty",
                "progress": float(rainfall_penalty),
                "color": "danger",
            },
            {
                "name": "Vegetation Index (NDVI)",
                "impactType": "boost",
                "value": float(ndvi_boost),
                "display": f"+{ndvi_boost}% boost",
                "progress": float(ndvi_boost),
                "color": "boost",
            },
        ]

        # ─────────────────────────────────────────────────────────────
        # 6. Prescriptive AI Action Plan
        # ─────────────────────────────────────────────────────────────
        action_plan = [
            (
                "High soil moisture alert: Inspect slope drainage and reinforce haul road gravel."
                if soil_moisture > 50
                else "Soil stability optimal: Maintain standard routine drainage channels."
            ),
            (
                f"Equipment downtime warning ({equipment_downtime}h): Deploy mobile maintenance rig for hydraulic servicing."
                if equipment_downtime > 8
                else "Fleet mechanics stable: Equipment operating within normal 8h window."
            ),
            (
                f"Critical {shortfall_pct}% shortfall predicted: Reallocate {round(shortfall_tons / 1000.0)}K tons quota to auxiliary bench."
                if shortfall_pct > 20
                else f"Production rate stable: Project on track to meet {round(target_quota / 1000.0)}K tons target."
            ),
        ]

        return {
            "predictedProduction": int(predicted_production),
            "predictedProductionFormatted": f"{(predicted_production / 1000.0):.1f}K T",
            "targetQuotaFormatted": f"{round(target_quota / 1000.0)}K T",
            "shortfallPercentage": float(shortfall_pct),
            "shortfallRisk": shortfall_risk,
            "reserveScore": int(reserve_score),
            "reserveConfidence": reserve_confidence,
            "featureImportance": feature_importance,
            "actionPlan": action_plan,
            "computedAt": datetime.now().strftime("%H:%M:%S")
        }


simulator_service = SimulatorService()
