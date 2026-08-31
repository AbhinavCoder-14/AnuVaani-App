from __future__ import annotations

import io
import wave


class PcmBuffer:
    """Accumulates raw PCM16 bytes for one audio session."""

    def __init__(self) -> None:
        self._chunks: list[bytes] = []
        self._size = 0

    def append(self, data: bytes) -> None:
        self._chunks.append(data)
        self._size += len(data)

    @property
    def size(self) -> int:
        return self._size

    def get_bytes(self) -> bytes:
        return b"".join(self._chunks)

    def clear(self) -> None:
        self._chunks.clear()
        self._size = 0
