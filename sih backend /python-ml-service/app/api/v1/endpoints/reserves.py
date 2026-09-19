from fastapi import APIRouter, HTTPException

from app.models.reserve_schema import (
    ReservePredictRequest,
    ReservePredictResponse
)

from app.services.interpolation_service import (
    interpolation_service
)


router = APIRouter()


@router.post(
    "/predict-reserves",
    response_model=ReservePredictResponse
)
def predict_reserves(
    req: ReservePredictRequest
):

    try:

        grade, grade_class = (
            interpolation_service.predict_grade(

                req.latitude,

                req.longitude,

                req.depth_m,

                req.surface_ndvi,

                req.surface_ndwi,

                req.slope_deg,

                req.fracture_density,

                req.rock_hardness,

                req.distance_to_fault_m,

                req.fe_content,

                req.sio2_content
            )
        )

        return ReservePredictResponse(

            predicted_mn_percentage=grade,

            grade_class=grade_class
        )

    except RuntimeError as e:

        raise HTTPException(
            status_code=503,
            detail=str(e)
        )