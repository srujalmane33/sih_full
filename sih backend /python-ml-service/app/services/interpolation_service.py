import numpy as np

from app.core.model_loader import model_store


class InterpolationService:

    @staticmethod
    def predict_grade(
        latitude: float,
        longitude: float,
        depth_m: float,
        surface_ndvi: float,
        surface_ndwi: float,
        slope_deg: float,
        fracture_density: float,
        rock_hardness: float,
        distance_to_fault_m: float,
        fe_content: float,
        sio2_content: float
    ):

        if model_store.reserve_model is None:
            raise RuntimeError(
                "Reserve model is not loaded."
            )

        # ====================================================
        # IMPORTANT
        #
        # Feature order MUST be exactly the same as the
        # training script.
        # ====================================================

        features = np.array([[
            latitude,
            longitude,
            depth_m,
            surface_ndvi,
            surface_ndwi,
            slope_deg,
            fracture_density,
            rock_hardness,
            distance_to_fault_m,
            fe_content,
            sio2_content
        ]])

        # ====================================================
        # Prediction
        # ====================================================

        prediction = (
            model_store.reserve_model
            .predict(features)[0]
        )

        predicted_grade = float(
            prediction
        )

        # ====================================================
        # Grade classification
        # ====================================================

        if predicted_grade >= 35:

            grade_class = (
                "High-Grade (>35% Mn)"
            )

        elif predicted_grade >= 20:

            grade_class = (
                "Medium-Grade (20-35% Mn)"
            )

        else:

            grade_class = (
                "Low-Grade / Waste"
            )

        return (
            round(predicted_grade, 2),
            grade_class
        )


interpolation_service = InterpolationService()