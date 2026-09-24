from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class SimulatorPredictRequest(BaseModel):
    location_name: Optional[str] = "Balaghat Extension Prospect"
    latitude: float
    longitude: float
    target_quota: float
    rainfall: float
    soil_moisture: float
    equipment_downtime: float
    ndvi: float
    rock_hardness: Any

class FeatureImportanceItem(BaseModel):
    name: str
    impactType: str
    value: float
    display: str
    progress: float
    color: str

class SimulatorPredictResponse(BaseModel):
    predictedProduction: int
    predictedProductionFormatted: str
    targetQuotaFormatted: str
    shortfallPercentage: float
    shortfallRisk: str
    reserveScore: int
    reserveConfidence: str
    featureImportance: List[FeatureImportanceItem]
    actionPlan: List[str]
    computedAt: str
