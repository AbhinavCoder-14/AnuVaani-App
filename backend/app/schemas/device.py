from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class DeviceStatus(str, Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    LISTENING = "listening"


class DeviceEventType(str, Enum):
    DEVICE_CONNECTED = "device_connected"
    DEVICE_DISCONNECTED = "device_disconnected"
    KWS_LISTENING = "kws_listening"
    WAKE_WORD_DETECTED = "wake_word_detected"


class DeviceInfo(BaseModel):
    device_id: str
    name: str | None = None
    status: DeviceStatus = DeviceStatus.DISCONNECTED
    last_seen: datetime | None = None


class DeviceConnectedPayload(BaseModel):
    type: Literal[DeviceEventType.DEVICE_CONNECTED] = DeviceEventType.DEVICE_CONNECTED
    device_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class DeviceDisconnectedPayload(BaseModel):
    type: Literal[DeviceEventType.DEVICE_DISCONNECTED] = DeviceEventType.DEVICE_DISCONNECTED
    device_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class KwsListeningPayload(BaseModel):
    type: Literal[DeviceEventType.KWS_LISTENING] = DeviceEventType.KWS_LISTENING
    device_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class WakeWordDetectedPayload(BaseModel):
    type: Literal[DeviceEventType.WAKE_WORD_DETECTED] = DeviceEventType.WAKE_WORD_DETECTED
    device_id: str
    keyword: str | None = None
    confidence: float | None = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
