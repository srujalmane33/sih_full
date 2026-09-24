from fastapi import APIRouter, HTTPException

from app.models.shortfall_schema import (
    ShortfallPredictRequest,
    ShortfallPredictResponse
)

from app.services.shortfall_service import (
    shortfall_service
)


router = APIRouter()


@router.post(
    "/predict-shortfall",
    response_model=ShortfallPredictResponse
)
def predict_shortfall(
    req: ShortfallPredictRequest
):

    try:

        (
            probability,
            risk_level,
            is_deficit,
            action
        ) = shortfall_service.predict_risk(

            req.pit_name,

            req.rainfall_mm,

            req.water_logging_hours,

            req.active_dumpers,

            req.active_excavators,

            req.equipment_availability,

            req.blasting_delayed,

            req.haul_distance_km,

            req.shift_efficiency
        )


        return ShortfallPredictResponse(

            pit_name=req.pit_name,

            shortfall_probability=probability,

            risk_level=risk_level,

            predicted_deficit_risk=is_deficit,

            recommended_action=action
        )


    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


    except RuntimeError as e:

        raise HTTPException(
            status_code=503,
            detail=str(e)
        )