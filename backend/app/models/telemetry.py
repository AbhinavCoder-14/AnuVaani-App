from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class DeviceLifecycleState(str, Enum):
    LISTENING = "LISTENING"
    WAKE_DETECTED = "WAKE_DETECTED"
    STREAMING = "STREAMING"
    ASR_PROCESSING = "ASR_PROCESSING"
    PROCESSING_COMPLETE = "PROCESSING_COMPLETE"
    DISCONNECTED = "DISCONNECTED"


class TelemetryPacket(BaseModel):
    device_id: str
    cpu_percent: float = 0.0
    ram_kb: int = 0
    wake: bool = False
    state: DeviceLifecycleState = DeviceLifecycleState.LISTENING
    received_at: datetime = Field(default_factory=datetime.utcnow)
