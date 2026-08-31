import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws/device")
async def device_stream(websocket: WebSocket) -> None:
    """Receives audio and telemetry from edge devices (placeholder lifecycle)."""
    await websocket.accept()
    client = websocket.client
    logger.info("Device connected: %s:%s", client.host if client else "unknown", client.port if client else "?")

    try:
        while True:
            message = await websocket.receive()
            if message.get("type") == "websocket.disconnect":
                break
            # Audio protocol and event parsing will be implemented later
    except WebSocketDisconnect:
        logger.info("Device disconnected")
    finally:
        logger.info("Device connection closed")
