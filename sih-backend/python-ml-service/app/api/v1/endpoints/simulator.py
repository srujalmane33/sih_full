from fastapi import APIRouter, HTTPException
from app.models.simulator_schema import SimulatorPredictRequest, SimulatorPredictResponse
from app.services.simulator_service import simulator_service

router = APIRouter()

@router.post("/predict-simulator", response_model=SimulatorPredictResponse)
def predict_simulator(req: SimulatorPredictRequest):
    try:
        result = simulator_service.predict(
            location_name=req.location_name,
            latitude=req.latitude,
            longitude=req.longitude,
            target_quota=req.target_quota,
            rainfall=req.rainfall,
            soil_moisture=req.soil_moisture,
            equipment_downtime=req.equipment_downtime,
            ndvi=req.ndvi,
            rock_hardness=req.rock_hardness
        )
        return SimulatorPredictResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
