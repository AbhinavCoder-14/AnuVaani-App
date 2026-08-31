from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class IntentType(str, Enum):
    GET_DEVICE_STATUS = "GET_DEVICE_STATUS"
    GET_CPU_USAGE = "GET_CPU_USAGE"
    GET_MEMORY_USAGE = "GET_MEMORY_USAGE"
    GET_NETWORK_STATUS = "GET_NETWORK_STATUS"
    GET_SESSION_STATS = "GET_SESSION_STATS"
    GET_DEVICE_METRICS = "GET_DEVICE_METRICS"
    UNKNOWN = "UNKNOWN"


class VoiceIntent(BaseModel):
    intent: IntentType
    confidence: float
    parameters: dict[str, str] = Field(default_factory=dict)
    transcript: str
    resolved_at: datetime = Field(default_factory=datetime.utcnow)


class ActionResult(BaseModel):
    action: IntentType
    result: dict
    executed_at: datetime = Field(default_factory=datetime.utcnow)
