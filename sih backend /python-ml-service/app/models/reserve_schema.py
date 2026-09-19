from pydantic import BaseModel, Field


class ReservePredictRequest(BaseModel):

    latitude: float

    longitude: float

    depth_m: float

    surface_ndvi: float = Field(
        default=0.35
    )

    surface_ndwi: float = Field(
        default=0.10
    )

    slope_deg: float = Field(
        default=10.0
    )

    fracture_density: float = Field(
        default=5.0
    )

    rock_hardness: float = Field(
        default=65.0
    )

    distance_to_fault_m: float = Field(
        default=10.0
    )

    fe_content: float = Field(
        default=10.0
    )

    sio2_content: float = Field(
        default=45.0
    )


class ReservePredictResponse(BaseModel):

    predicted_mn_percentage: float

    grade_class: str