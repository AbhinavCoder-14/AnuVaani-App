from fastapi import APIRouter

from app.schemas.device import DeviceInfo

router = APIRouter(prefix="/devices", tags=["devices"])


@router.get("", response_model=list[DeviceInfo])
async def list_devices() -> list[DeviceInfo]:
    """Placeholder — device registry will be implemented with WebSocket lifecycle."""
    return []
