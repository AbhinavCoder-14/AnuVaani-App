import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.routes import router as api_router
from app.core.config import settings
from app.network.tcp_audio import tcp_server
from app.network.udp_telemetry import udp_server

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await udp_server.start()
    await tcp_server.start()
    logger.info(
        "AnuVaani backend ready — REST :%s | UDP :%s | TCP :%s",
        settings.port,
        settings.udp_telemetry_port,
        settings.tcp_audio_port,
    )
    yield
    await tcp_server.stop()
    await udp_server.stop()


app = FastAPI(
    title=settings.app_name,
    description="Edge voice backend — UDP telemetry, TCP audio, ASR, intent engine",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(api_router)

# Legacy WebSocket routes kept for optional future use
try:
    from app.websocket.dashboard import router as dashboard_ws_router
    from app.websocket.device_stream import router as device_ws_router

    app.include_router(device_ws_router)
    app.include_router(dashboard_ws_router)
except ImportError:
    pass
