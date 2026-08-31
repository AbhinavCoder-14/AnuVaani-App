from __future__ import annotations

import asyncio
import logging

from app.core.config import settings
from app.core.device_state import device_state
from app.models.telemetry import DeviceLifecycleState
from app.network.protocols import parse_telemetry_line

logger = logging.getLogger(__name__)


def _parse_state(raw: str) -> DeviceLifecycleState:
    mapping = {s.value.lower(): s for s in DeviceLifecycleState}
    return mapping.get(raw.lower(), DeviceLifecycleState.LISTENING)


class UdpTelemetryServer:
    def __init__(self) -> None:
        self._transport: asyncio.DatagramTransport | None = None

    async def start(self) -> None:
        loop = asyncio.get_running_loop()
        self._transport, _ = await loop.create_datagram_endpoint(
            lambda: _UdpProtocol(self._handle_datagram),
            local_addr=(settings.host, settings.udp_telemetry_port),
        )
        logger.info("UDP telemetry listening on %s:%s", settings.host, settings.udp_telemetry_port)

    async def stop(self) -> None:
        if self._transport:
            self._transport.close()
            self._transport = None

    async def _handle_datagram(self, data: bytes, addr: tuple[str, int]) -> None:
        try:
            text = data.decode("utf-8", errors="replace").strip()
            fields = parse_telemetry_line(text)
            device_id = fields.get("device", "esp32-01")
            cpu = float(fields.get("cpu", "0"))
            ram = int(float(fields.get("ram", "0")))
            wake = fields.get("wake", "0") in ("1", "true", "True")
            state = _parse_state(fields.get("state", "listening"))

            await device_state.update_telemetry(
                device_id=device_id,
                cpu_percent=cpu,
                ram_kb=ram,
                wake=wake,
                state=state,
            )
            logger.debug("Telemetry from %s (%s): cpu=%.1f ram=%d state=%s", device_id, addr, cpu, ram, state.value)
        except Exception:
            logger.exception("Failed to parse UDP telemetry from %s", addr)


class _UdpProtocol(asyncio.DatagramProtocol):
    def __init__(self, handler) -> None:
        self._handler = handler

    def datagram_received(self, data: bytes, addr: tuple[str, int]) -> None:
        asyncio.create_task(self._handler(data, addr))


udp_server = UdpTelemetryServer()
