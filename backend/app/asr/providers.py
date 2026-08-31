from __future__ import annotations

import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class AsrProvider(ABC):
    @abstractmethod
    async def transcribe(self, wav_bytes: bytes) -> str:
        ...


class MockAsrProvider(AsrProvider):
    """Deterministic transcript for demos when Whisper is not installed."""

    async def transcribe(self, wav_bytes: bytes) -> str:
        duration_hint = len(wav_bytes) // 32000  # rough seconds at 16kHz mono
        if duration_hint < 1:
            return "show device status"
        if duration_hint < 3:
            return "show me current cpu usage"
        return "show me current device performance"


class WhisperAsrProvider(AsrProvider):
    def __init__(self, model_name: str = "base") -> None:
        self.model_name = model_name
        self._model = None

    def _load(self):
        if self._model is None:
            try:
                from faster_whisper import WhisperModel  # type: ignore
            except ImportError as exc:
                raise RuntimeError(
                    "Install faster-whisper to use ASR provider 'whisper': pip install faster-whisper"
                ) from exc
            self._model = WhisperModel(self.model_name, device="cpu", compute_type="int8")
        return self._model

    async def transcribe(self, wav_bytes: bytes) -> str:
        import asyncio
        import tempfile
        from pathlib import Path

        def _run() -> str:
            model = self._load()
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                tmp.write(wav_bytes)
                tmp_path = tmp.name
            try:
                segments, _ = model.transcribe(tmp_path)
                return " ".join(segment.text.strip() for segment in segments).strip()
            finally:
                Path(tmp_path).unlink(missing_ok=True)

        return await asyncio.to_thread(_run)


def get_asr_provider(name: str, whisper_model: str = "base") -> AsrProvider:
    if name == "whisper":
        return WhisperAsrProvider(whisper_model)
    return MockAsrProvider()
