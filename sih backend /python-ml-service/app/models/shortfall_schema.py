from pydantic import BaseModel, Field


# ============================================================
# Shortfall Prediction
# ============================================================

class ShortfallPredictRequest(BaseModel):

    pit_name: str

    rainfall_mm: float

    water_logging_hours: float = Field(
        default=0.0
    )

    active_dumpers: int

    active_excavators: int

    equipment_availability: float = Field(
        default=0.88
    )

    blasting_delayed: bool = Field(
        default=False
    )

    haul_distance_km: float = Field(
        default=4.0
    )

    shift_efficiency: float = Field(
        default=0.85
    )


class ShortfallPredictResponse(BaseModel):

    pit_name: str

    shortfall_probability: float

    risk_level: str

    predicted_deficit_risk: bool

    recommended_action: str


# ============================================================
# Optimization / Prescriptive Actions
# ============================================================

class OptimizationRequest(BaseModel):

    pit_name: str

    shortfall_probability: float

    rainfall_mm: float

    active_dumpers: int

    blasting_delayed: bool


class OptimizationResponse(BaseModel):

    prescribed_actions: list[str]