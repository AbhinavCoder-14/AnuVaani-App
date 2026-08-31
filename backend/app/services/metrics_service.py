"""Latency and performance metrics — placeholder for future implementation."""

from app.schemas.metrics import DeviceMetrics


class MetricsService:
    async def collect_device_metrics(self, device_id: str) -> DeviceMetrics:
        raise NotImplementedError("Metrics collection not implemented yet")
