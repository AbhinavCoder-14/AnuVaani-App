from fastapi import APIRouter

from app.core.device_state import device_state

router = APIRouter(prefix="/api", tags=["dashboard"])


@router.get("/device/status")
async def get_device_status() -> dict:
    snap = await device_state.snapshot()
    return {
        "status": snap["status"],
        "cpu_percent": snap["cpu_percent"],
        "ram_kb": snap["ram_kb"],
        "audio_streaming": snap["audio_streaming"],
        "wake_detected": snap["wake_detected"],
        "device_id": snap["device_id"],
        "last_telemetry": snap["last_telemetry"],
    }


@router.get("/session/current")
async def get_current_session() -> dict:
    session = await device_state.get_active_session()
    if not session:
        return {"session_id": None, "state": "IDLE", "wake_detected": False, "bytes_received": 0}

    return {
        "session_id": session.session_id,
        "wake_detected": True,
        "state": session.state.value,
        "bytes_received": session.bytes_received,
        "duration_seconds": session.duration_seconds,
        "transcript": session.transcript,
    }


@router.get("/voice/latest")
async def get_latest_voice() -> dict:
    voice = device_state.latest_voice
    action = device_state.latest_action
    if not voice:
        return {"transcript": None, "intent": None, "confidence": None, "action_result": None}

    return {
        "transcript": voice.transcript,
        "intent": voice.intent.value,
        "confidence": voice.confidence,
        "action_result": action.result if action else None,
    }


@router.get("/metrics")
async def get_system_metrics() -> dict:
    snap = await device_state.snapshot()
    return {
        "total_wake_events": snap["total_wake_events"],
        "total_audio_seconds": snap["total_audio_seconds"],
        "total_bytes_streamed": snap["total_bytes_streamed"],
        "average_latency_ms": snap["average_latency_ms"],
    }
