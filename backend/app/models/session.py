from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class SessionState(str, Enum):
    IDLE = "IDLE"
    STREAMING = "STREAMING"
    ASR_PROCESSING = "ASR_PROCESSING"
    COMPLETE = "COMPLETE"


class AudioSession(BaseModel):
    session_id: str
    device_id: str
    state: SessionState = SessionState.STREAMING
    wake_time: datetime | None = None
    audio_started: datetime | None = None
    audio_ended: datetime | None = None
    bytes_received: int = 0
    sample_rate: int = 16000
    channels: int = 1
    sample_width: int = 2
    transcript: str | None = None
    wav_path: str | None = None

    @property
    def duration_seconds(self) -> float | None:
        if not self.audio_started or not self.audio_ended:
            return None
        return (self.audio_ended - self.audio_started).total_seconds()
