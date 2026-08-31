"""Binary framing protocol for ESP32 ↔ backend TCP audio stream.

Packet layout:
    TYPE (1 byte) + LENGTH (4 bytes, big-endian) + PAYLOAD

Types:
    0x01 = AUDIO_START  — payload: UTF-8 device_id
    0x02 = AUDIO_CHUNK  — payload: raw PCM16 bytes
    0x03 = AUDIO_END    — payload: empty
"""

from __future__ import annotations

import struct
from enum import IntEnum


class PacketType(IntEnum):
    AUDIO_START = 0x01
    AUDIO_CHUNK = 0x02
    AUDIO_END = 0x03


HEADER_SIZE = 5  # 1 + 4
HEADER_FORMAT = "!BI"  # type + length


def encode_packet(packet_type: PacketType, payload: bytes = b"") -> bytes:
    return struct.pack(HEADER_FORMAT, int(packet_type), len(payload)) + payload


def try_decode_header(data: bytes) -> tuple[int, int] | None:
    if len(data) < HEADER_SIZE:
        return None
    packet_type, length = struct.unpack(HEADER_FORMAT, data[:HEADER_SIZE])
    return packet_type, length


def parse_telemetry_line(raw: str) -> dict[str, str]:
    """Parse compact UDP format: TEL|device=esp32-01|cpu=7.8|ram=182|wake=0|state=listening"""
    parts = raw.strip().split("|")
    if not parts or parts[0] != "TEL":
        raise ValueError(f"Invalid telemetry prefix: {raw!r}")

    fields: dict[str, str] = {}
    for part in parts[1:]:
        if "=" not in part:
            continue
        key, value = part.split("=", 1)
        fields[key.strip()] = value.strip()
    return fields
