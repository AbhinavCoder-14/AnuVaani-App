import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.devices import router as devices_router
from app.api.health import router as health_router
from app.core.config import settings
from app.websocket.dashboard import router as dashboard_ws_router
from app.websocket.device_stream import router as device_ws_router

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title=settings.app_name,
    description="Backend for the Edge Voice Activation System",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(devices_router, prefix="/api")
app.include_router(device_ws_router)
app.include_router(dashboard_ws_router)
