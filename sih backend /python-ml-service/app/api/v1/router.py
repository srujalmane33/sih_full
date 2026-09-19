from fastapi import APIRouter
from app.api.v1.endpoints import reserves, shortfall, optimize, simulator

api_router = APIRouter()
api_router.include_router(reserves.router, tags=["Reserves"])
api_router.include_router(shortfall.router, tags=["Shortfall"])
api_router.include_router(optimize.router, tags=["Optimization"])
api_router.include_router(simulator.router, tags=["Simulator"])