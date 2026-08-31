from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class AudioEventType(str, Enum):
    STREAM_STARTED = "stream_started"
    AUDIO_CHUNK = "audio_chunk"
    STREAM_ENDED = "stream_ended"
    ASR_PROCESSING = "asr_processing"
    PARTIAL_TRANSCRIPT = "partial_transcript"
    FINAL_TRANSCRIPT = "final_transcript"


class StreamStartedPayload(BaseModel):
    type: Literal[AudioEventType.STREAM_STARTED] = AudioEventType.STREAM_STARTED
    device_id: str
    session_id: str
    sample_rate: int = 16000
    channels: int = 1
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AudioChunkPayload(BaseModel):
    type: Literal[AudioEventType.AUDIO_CHUNK] = AudioEventType.AUDIO_CHUNK
    device_id: str
    session_id: str
    sequence: int
    # Binary PCM data will be sent as raw WebSocket frames, not in JSON events
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StreamEndedPayload(BaseModel):
    type: Literal[AudioEventType.STREAM_ENDED] = AudioEventType.STREAM_ENDED
    device_id: str
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AsrProcessingPayload(BaseModel):
    type: Literal[AudioEventType.ASR_PROCESSING] = AudioEventType.ASR_PROCESSING
    device_id: str
    session_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PartialTranscriptPayload(BaseModel):
    type: Literal[AudioEventType.PARTIAL_TRANSCRIPT] = AudioEventType.PARTIAL_TRANSCRIPT
    device_id: str
    session_id: str
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class FinalTranscriptPayload(BaseModel):
    type: Literal[AudioEventType.FINAL_TRANSCRIPT] = AudioEventType.FINAL_TRANSCRIPT
    device_id: str
    session_id: str
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
