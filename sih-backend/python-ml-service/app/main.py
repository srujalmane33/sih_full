from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.model_loader import model_store
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    model_store.load_models()
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
def health():
    return {"status": "ok", "service": "python-ml-service"}