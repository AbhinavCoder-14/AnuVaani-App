from __future__ import annotations

import logging

from app.core.config import settings
from app.core.device_state import device_state
from app.intent.matcher import match_intent
from app.models.intent import ActionResult, IntentType, VoiceIntent

logger = logging.getLogger(__name__)


class IntentEngine:
    async def resolve(self, transcript: str) -> VoiceIntent:
        intent, confidence = match_intent(transcript, settings.intent_confidence_threshold)
        return VoiceIntent(
            intent=intent,
            confidence=round(confidence, 3),
            transcript=transcript,
        )

    async def execute(self, voice_intent: VoiceIntent) -> ActionResult:
        snapshot = await device_state.snapshot()
        session = await device_state.get_active_session()

        if voice_intent.intent == IntentType.GET_CPU_USAGE:
            result = {"cpu_percent": snapshot["cpu_percent"]}
        elif voice_intent.intent == IntentType.GET_MEMORY_USAGE:
            result = {"ram_kb": snapshot["ram_kb"]}
        elif voice_intent.intent == IntentType.GET_DEVICE_STATUS:
            result = {
                "status": snapshot["status"],
                "cpu_percent": snapshot["cpu_percent"],
                "ram_kb": snapshot["ram_kb"],
            }
        elif voice_intent.intent == IntentType.GET_NETWORK_STATUS:
            result = {
                "device_id": snapshot["device_id"],
                "last_telemetry": snapshot["last_telemetry"],
                "online": snapshot["last_telemetry"] is not None,
            }
        elif voice_intent.intent == IntentType.GET_SESSION_STATS:
            result = {
                "session_id": session.session_id if session else None,
                "bytes_received": session.bytes_received if session else 0,
                "duration_seconds": session.duration_seconds if session else None,
                "transcript": session.transcript if session else None,
            }
        elif voice_intent.intent == IntentType.GET_DEVICE_METRICS:
            result = {
                "status": snapshot["status"],
                "cpu_percent": snapshot["cpu_percent"],
                "ram_kb": snapshot["ram_kb"],
                "audio_streaming": snapshot["audio_streaming"],
                "total_wake_events": snapshot["total_wake_events"],
            }
        else:
            result = {"message": "Could not understand command", "transcript": voice_intent.transcript}

        action = ActionResult(action=voice_intent.intent, result=result)
        logger.info("Action %s → %s", action.action.value, result)
        return action


intent_engine = IntentEngine()
