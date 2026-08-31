from __future__ import annotations

import logging

from app.asr.providers import AsrProvider, get_asr_provider
from app.core.config import settings

logger = logging.getLogger(__name__)


class AsrService:
    def __init__(self, provider: AsrProvider | None = None) -> None:
        self._provider = provider or get_asr_provider(settings.asr_provider, settings.whisper_model)

    async def transcribe_wav(self, wav_bytes: bytes) -> str:
        transcript = await self._provider.transcribe(wav_bytes)
        logger.info("ASR transcript: %s", transcript)
        return transcript


asr_service = AsrService()
