import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws/dashboard")
async def dashboard_stream(websocket: WebSocket) -> None:
    """Pushes real-time events and metrics to the frontend dashboard (placeholder lifecycle)."""
    await websocket.accept()
    client = websocket.client
    logger.info("Dashboard connected: %s:%s", client.host if client else "unknown", client.port if client else "?")

    try:
        while True:
            message = await websocket.receive()
            if message.get("type") == "websocket.disconnect":
                break
            # Event broadcasting will be implemented later
    except WebSocketDisconnect:
        logger.info("Dashboard disconnected")
    finally:
        logger.info("Dashboard connection closed")
