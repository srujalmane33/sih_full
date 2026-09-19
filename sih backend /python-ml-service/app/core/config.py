import os

class Settings:
    PROJECT_NAME: str = "MOIL Mining ML Service"
    API_V1_STR: str = "/api/v1"
    MODEL_DIR: str = os.path.join(os.path.dirname(__file__), "../../ml/trained_models")

settings = Settings()