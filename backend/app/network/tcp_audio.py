from __future__ import annotations

import asyncio
import logging

from app.audio.session import session_manager
from app.core.config import settings
from app.network.protocols import HEADER_SIZE, PacketType, try_decode_header

logger = logging.getLogger(__name__)


class TcpAudioServer:
    async def start(self) -> None:
        server = await asyncio.start_server(
            self._handle_client,
            host=settings.host,
            port=settings.tcp_audio_port,
        )
        self._server = server
        logger.info("TCP audio listening on %s:%s", settings.host, settings.tcp_audio_port)

    async def stop(self) -> None:
        if hasattr(self, "_server"):
            self._server.close()
            await self._server.wait_closed()

    async def _handle_client(
        self,
        reader: asyncio.StreamReader,
        writer: asyncio.StreamWriter,
    ) -> None:
        peer = writer.get_extra_info("peername")
        logger.info("TCP audio client connected: %s", peer)
        session_id: str | None = None
        buffer = b""

        try:
            while True:
                chunk = await reader.read(4096)
                if not chunk:
                    break
                buffer += chunk

                while True:
                    header = try_decode_header(buffer)
                    if header is None:
                        break

                    packet_type, payload_len = header
                    total_len = HEADER_SIZE + payload_len
                    if len(buffer) < total_len:
                        break

                    payload = buffer[HEADER_SIZE:total_len]
                    buffer = buffer[total_len:]

                    if packet_type == PacketType.AUDIO_START:
                        device_id = payload.decode("utf-8", errors="replace").strip() or "esp32-01"
                        session_id = await session_manager.on_audio_start(device_id)
                    elif packet_type == PacketType.AUDIO_CHUNK:
                        if session_id:
                            await session_manager.on_audio_chunk(session_id, payload)
                    elif packet_type == PacketType.AUDIO_END:
                        if session_id:
                            await session_manager.on_audio_end(session_id)
                            session_id = None
                    else:
                        logger.warning("Unknown packet type 0x%02x from %s", packet_type, peer)
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.exception("TCP audio handler error for %s", peer)
        finally:
            writer.close()
            await writer.wait_closed()
            logger.info("TCP audio client disconnected: %s", peer)


tcp_server = TcpAudioServer()
