import numpy as np

from app.core.model_loader import model_store

from app.services.prescriptive_service import (
    prescriptive_service
)


PIT_MAP = {

    "Pit-1_East": 0,

    "Pit-2_Central": 1,

    "Pit-3_DeepBench": 2
}


class ShortfallService:

    @staticmethod
    def predict_risk(

        pit_name: str,

        rainfall_mm: float,

        water_logging_hours: float,

        active_dumpers: int,

        active_excavators: int,

        equipment_availability: float,

        blasting_delayed: bool,

        haul_distance_km: float,

        shift_efficiency: float

    ):

        if model_store.shortfall_model is None:

            raise RuntimeError(
                "Shortfall model is not loaded."
            )


        # ====================================================
        # Validate pit
        # ====================================================

        if pit_name not in PIT_MAP:

            raise ValueError(
                f"Unknown pit: {pit_name}"
            )


        pit_code = PIT_MAP[pit_name]


        # ====================================================
        # Feature order MUST match training
        # ====================================================

        features = np.array([[

            pit_code,

            rainfall_mm,

            water_logging_hours,

            active_dumpers,

            active_excavators,

            equipment_availability,

            int(blasting_delayed),

            haul_distance_km,

            shift_efficiency

        ]])


        # ====================================================
        # Prediction
        # ====================================================

        probability = float(

            model_store.shortfall_model
            .predict_proba(features)[0][1]

        )


        # ====================================================
        # Risk classification
        # ====================================================

        if probability > 0.70:

            risk_level = "CRITICAL"

        elif probability > 0.40:

            risk_level = "ELEVATED"

        else:

            risk_level = "NORMAL"


        # ====================================================
        # Prescriptive recommendation
        # ====================================================

        action = (
            prescriptive_service.recommend(
                rainfall_mm,
                active_dumpers,
                blasting_delayed
            )
        )


        return (

            round(probability, 3),

            risk_level,

            probability > 0.50,

            action

        )


shortfall_service = ShortfallService()