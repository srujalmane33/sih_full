import os
import joblib

from app.core.config import settings


class ModelStore:

    def __init__(self):

        self.reserve_model = None

        self.shortfall_model = None


    def load_models(self):

        reserve_path = os.path.join(
            settings.MODEL_DIR,
            "reserve_rf_model.joblib"
        )

        shortfall_path = os.path.join(
            settings.MODEL_DIR,
            "shortfall_gradient_model.joblib"
        )


        # ====================================================
        # Reserve model
        # ====================================================

        if os.path.exists(reserve_path):

            self.reserve_model = joblib.load(
                reserve_path
            )

            print(
                "Reserve model loaded successfully."
            )

        else:

            print(
                "WARNING: Reserve model not found:"
                f" {reserve_path}"
            )


        # ====================================================
        # Shortfall model
        # ====================================================

        if os.path.exists(shortfall_path):

            self.shortfall_model = joblib.load(
                shortfall_path
            )

            print(
                "Shortfall model loaded successfully."
            )

        else:

            print(
                "WARNING: Shortfall model not found:"
                f" {shortfall_path}"
            )


model_store = ModelStore()