from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class MetricsEventType(str, Enum):
    METRICS_UPDATED = "metrics_updated"


class DeviceMetrics(BaseModel):
    cpu_percent: float | None = None
    ram_mb: float | None = None
    model_size_kb: float | None = None
    kws_inference_ms: float | None = None
    network_latency_ms: float | None = None
    end_to_end_latency_ms: float | None = None


class MetricsUpdatedPayload(BaseModel):
    type: Literal[MetricsEventType.METRICS_UPDATED] = MetricsEventType.METRICS_UPDATED
    device_id: str
    metrics: DeviceMetrics
    timestamp: datetime = Field(default_factory=datetime.utcnow)
