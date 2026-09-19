from fastapi import APIRouter
from app.models.shortfall_schema import OptimizationRequest, OptimizationResponse
from app.services.prescriptive_service import prescriptive_service

router = APIRouter()

@router.post("/prescribe-actions", response_model=OptimizationResponse)
def prescribe_actions(req: OptimizationRequest):
    action = prescriptive_service.recommend(req.rainfall_mm, req.active_dumpers, req.blasting_delayed)
    return OptimizationResponse(prescribed_actions=[action])