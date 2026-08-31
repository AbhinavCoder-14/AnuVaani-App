"""Audio session and stream processing — placeholder for future implementation."""


class AudioService:
    async def handle_stream_start(self, device_id: str, session_id: str) -> None:
        raise NotImplementedError("Audio streaming pipeline not implemented yet")

    async def handle_audio_chunk(self, device_id: str, session_id: str, data: bytes) -> None:
        raise NotImplementedError("Audio streaming pipeline not implemented yet")

    async def handle_stream_end(self, device_id: str, session_id: str) -> None:
        raise NotImplementedError("Audio streaming pipeline not implemented yet")
