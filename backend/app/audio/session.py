from __future__ import annotations

import logging
from datetime import datetime
from pathlib import Path

from app.asr.service import asr_service
from app.audio.pcm_buffer import PcmBuffer
from app.audio.wav_converter import pcm_to_wav_bytes, save_wav_file
from app.core.config import settings
from app.core.device_state import device_state
from app.intent.engine import intent_engine
from app.models.session import SessionState

logger = logging.getLogger(__name__)


class AudioSessionManager:
    def __init__(self) -> None:
        self._buffers: dict[str, PcmBuffer] = {}
        Path(settings.audio_storage_dir).mkdir(parents=True, exist_ok=True)

    def _buffer_for(self, session_id: str) -> PcmBuffer:
        if session_id not in self._buffers:
            self._buffers[session_id] = PcmBuffer()
        return self._buffers[session_id]

    async def on_audio_start(self, device_id: str) -> str:
        session = await device_state.create_session(device_id)
        self._buffer_for(session.session_id)
        await device_state.mark_streaming(session)
        logger.info("Audio session started: %s for %s", session.session_id, device_id)
        return session.session_id

    async def on_audio_chunk(self, session_id: str, pcm_data: bytes) -> None:
        buffer = self._buffer_for(session_id)
        buffer.append(pcm_data)
        session = await device_state.get_session(session_id)
        if session:
            session.bytes_received = buffer.size
            await device_state.update_session(session)

    async def on_audio_end(self, session_id: str) -> None:
        session = await device_state.get_session(session_id)
        if not session:
            logger.warning("AUDIO_END for unknown session %s", session_id)
            return

        buffer = self._buffer_for(session_id)
        pcm_data = buffer.get_bytes()
        session.audio_ended = datetime.utcnow()
        session.bytes_received = len(pcm_data)
        session.state = SessionState.ASR_PROCESSING
        await device_state.update_session(session)

        wav_bytes = pcm_to_wav_bytes(
            pcm_data,
            sample_rate=settings.sample_rate,
            channels=settings.channels,
            sample_width=settings.sample_width,
        )
        wav_path = Path(settings.audio_storage_dir) / f"{session_id}.wav"
        save_wav_file(
            str(wav_path),
            pcm_data,
            sample_rate=settings.sample_rate,
            channels=settings.channels,
            sample_width=settings.sample_width,
        )
        session.wav_path = str(wav_path)

        wake_ms = None
        if session.wake_time and session.audio_ended:
            wake_ms = (session.audio_ended - session.wake_time).total_seconds() * 1000

        transcript = await asr_service.transcribe_wav(wav_bytes)
        session.transcript = transcript

        voice_intent = await intent_engine.resolve(transcript)
        action = await intent_engine.execute(voice_intent)

        session.state = SessionState.COMPLETE
        await device_state.complete_session(session)
        await device_state.set_voice_result(voice_intent, action, latency_ms=wake_ms)

        self._buffers.pop(session_id, None)
        logger.info(
            "Session %s complete: %d bytes, intent=%s (%.0f%%)",
            session_id,
            len(pcm_data),
            voice_intent.intent.value,
            voice_intent.confidence * 100,
        )


session_manager = AudioSessionManager()
