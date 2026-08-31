"""Central device state — updated by UDP telemetry and TCP audio pipeline."""

from __future__ import annotations

import asyncio
import uuid
from datetime import datetime

from app.models.intent import ActionResult, VoiceIntent
from app.models.session import AudioSession, SessionState
from app.models.telemetry import DeviceLifecycleState


class DeviceStateManager:
    """Thread-safe in-memory state for the prototype."""

    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self.device_id: str = "esp32-01"
        self.status: DeviceLifecycleState = DeviceLifecycleState.DISCONNECTED
        self.cpu_percent: float = 0.0
        self.ram_kb: int = 0
        self.wake_detected: bool = False
        self.audio_streaming: bool = False
        self.last_telemetry: datetime | None = None
        self.active_session_id: str | None = None
        self._sessions: dict[str, AudioSession] = {}
        self.latest_voice: VoiceIntent | None = None
        self.latest_action: ActionResult | None = None
        # Aggregate metrics
        self.total_wake_events: int = 0
        self.total_audio_seconds: float = 0.0
        self.total_bytes_streamed: int = 0
        self._latency_samples_ms: list[float] = []

    async def update_telemetry(
        self,
        *,
        device_id: str,
        cpu_percent: float,
        ram_kb: int,
        wake: bool,
        state: DeviceLifecycleState,
    ) -> None:
        async with self._lock:
            self.device_id = device_id
            self.cpu_percent = cpu_percent
            self.ram_kb = ram_kb
            self.wake_detected = wake
            self.status = state
            self.last_telemetry = datetime.utcnow()
            if wake and state == DeviceLifecycleState.WAKE_DETECTED:
                self.total_wake_events += 1

    async def mark_streaming(self, session: AudioSession) -> None:
        async with self._lock:
            self.audio_streaming = True
            self.status = DeviceLifecycleState.STREAMING
            self.active_session_id = session.session_id
            self._sessions[session.session_id] = session

    async def update_session(self, session: AudioSession) -> None:
        async with self._lock:
            self._sessions[session.session_id] = session
            if session.state == SessionState.ASR_PROCESSING:
                self.status = DeviceLifecycleState.ASR_PROCESSING

    async def complete_session(self, session: AudioSession) -> None:
        async with self._lock:
            self._sessions[session.session_id] = session
            self.audio_streaming = False
            self.status = DeviceLifecycleState.PROCESSING_COMPLETE
            self.total_bytes_streamed += session.bytes_received
            if session.duration_seconds:
                self.total_audio_seconds += session.duration_seconds

    async def set_voice_result(
        self,
        intent: VoiceIntent,
        action: ActionResult,
        latency_ms: float | None = None,
    ) -> None:
        async with self._lock:
            self.latest_voice = intent
            self.latest_action = action
            if latency_ms is not None:
                self._latency_samples_ms.append(latency_ms)

    async def create_session(self, device_id: str) -> AudioSession:
        session_id = uuid.uuid4().hex[:12]
        now = datetime.utcnow()
        session = AudioSession(
            session_id=session_id,
            device_id=device_id,
            wake_time=now,
            audio_started=now,
        )
        async with self._lock:
            self._sessions[session_id] = session
            self.active_session_id = session_id
        return session

    async def get_active_session(self) -> AudioSession | None:
        async with self._lock:
            if not self.active_session_id:
                return None
            return self._sessions.get(self.active_session_id)

    async def get_session(self, session_id: str) -> AudioSession | None:
        async with self._lock:
            return self._sessions.get(session_id)

    async def snapshot(self) -> dict:
        async with self._lock:
            avg_latency = (
                sum(self._latency_samples_ms) / len(self._latency_samples_ms)
                if self._latency_samples_ms
                else 0.0
            )
            return {
                "device_id": self.device_id,
                "status": self.status.value,
                "cpu_percent": self.cpu_percent,
                "ram_kb": self.ram_kb,
                "wake_detected": self.wake_detected,
                "audio_streaming": self.audio_streaming,
                "last_telemetry": self.last_telemetry.isoformat() if self.last_telemetry else None,
                "active_session_id": self.active_session_id,
                "total_wake_events": self.total_wake_events,
                "total_audio_seconds": round(self.total_audio_seconds, 2),
                "total_bytes_streamed": self.total_bytes_streamed,
                "average_latency_ms": round(avg_latency, 1),
            }


device_state = DeviceStateManager()
