#!/usr/bin/env python3
"""Simulate ESP32 UDP telemetry + TCP audio for local backend testing.

Usage (from backend/ with venv active):
    python scripts/simulate_device.py
"""

from __future__ import annotations

import asyncio
import math
import socket
import struct
import time

HOST = "127.0.0.1"
UDP_PORT = 8766
TCP_PORT = 8765

HEADER_FORMAT = "!BI"


def encode_packet(packet_type: int, payload: bytes = b"") -> bytes:
    return struct.pack(HEADER_FORMAT, packet_type, len(payload)) + payload


def send_telemetry(sock: socket.socket, *, cpu: float, ram: int, wake: int, state: str) -> None:
    msg = f"TEL|device=esp32-01|cpu={cpu:.1f}|ram={ram}|wake={wake}|state={state}"
    sock.sendto(msg.encode("utf-8"), (HOST, UDP_PORT))


def generate_pcm_tone(duration_s: float, sample_rate: int = 16000) -> bytes:
    """Generate simple PCM16 mono tone (not real speech — enough to test pipeline)."""
    samples = int(duration_s * sample_rate)
    pcm = bytearray()
    for i in range(samples):
        value = int(8000 * math.sin(2 * math.pi * 440 * i / sample_rate))
        pcm.extend(struct.pack("<h", value))
    return bytes(pcm)


async def run_audio_session() -> None:
    reader, writer = await asyncio.open_connection(HOST, TCP_PORT)

    writer.write(encode_packet(0x01, b"esp32-01"))
    await writer.drain()

    pcm = generate_pcm_tone(2.5)
    chunk_size = 3200  # 100 ms at 16 kHz mono PCM16
    for i in range(0, len(pcm), chunk_size):
        writer.write(encode_packet(0x02, pcm[i : i + chunk_size]))
        await writer.drain()
        await asyncio.sleep(0.05)

    writer.write(encode_packet(0x03))
    await writer.drain()
    writer.close()
    await writer.wait_closed()
    print("TCP audio session complete")


async def main() -> None:
    udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    print("Sending telemetry (listening)...")
    for _ in range(3):
        send_telemetry(udp, cpu=7.8, ram=182, wake=0, state="listening")
        await asyncio.sleep(1)

    print("Wake detected...")
    send_telemetry(udp, cpu=8.1, ram=185, wake=1, state="wake_detected")
    await asyncio.sleep(0.5)

    print("Starting TCP audio stream...")
    send_telemetry(udp, cpu=9.0, ram=190, wake=1, state="streaming")
    await run_audio_session()

    send_telemetry(udp, cpu=7.5, ram=180, wake=0, state="processing_complete")
    print("Done. Check GET http://localhost:8000/api/voice/latest")


if __name__ == "__main__":
    asyncio.run(main())
