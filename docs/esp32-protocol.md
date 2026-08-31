# ESP32 ↔ Backend Protocol Contract

This document defines the exact packet formats Mayank's ESP32 firmware and the Python backend must share.

## Ports

| Channel | Port | Direction |
|---------|------|-----------|
| UDP Telemetry | **8766** | ESP32 → Backend (every 1 s) |
| TCP Audio | **8765** | ESP32 → Backend (after wake) |
| REST API | **8000** | Next.js → Backend |

---

## UDP Telemetry (port 8766)

Compact text format, UTF-8, one datagram per second:

```text
TEL|device=esp32-01|cpu=7.8|ram=182|wake=0|state=listening
```

| Field | Type | Example |
|-------|------|---------|
| `device` | string | `esp32-01` |
| `cpu` | float | `7.8` (percent) |
| `ram` | int | `182` (KB) |
| `wake` | 0 or 1 | `1` when wake word detected |
| `state` | string | `listening`, `wake_detected`, `streaming`, `asr_processing`, `processing_complete` |

---

## TCP Audio (port 8765)

Binary framed protocol. ESP32 connects at boot and keeps the socket open.

### Packet layout

```text
┌──────────┬──────────────┬──────────────┐
│ TYPE     │ LENGTH       │ PAYLOAD      │
│ 1 byte   │ 4 bytes BE   │ N bytes      │
└──────────┴──────────────┴──────────────┘
```

### Packet types

| Type | Value | Payload |
|------|-------|---------|
| `AUDIO_START` | `0x01` | UTF-8 device_id (e.g. `esp32-01`) |
| `AUDIO_CHUNK` | `0x02` | Raw PCM16 mono bytes |
| `AUDIO_END` | `0x03` | Empty |

### Audio format

```text
PCM16 · 16 kHz · Mono
```

### Flow

```text
ESP32 boot → TCP connect to backend:8765
KWS always-on (local)
Wake detected → UDP wake=1
Send AUDIO_START
Send AUDIO_CHUNK × N
Send AUDIO_END
Backend → ASR → Intent → Action
```

---

## REST API (port 8000)

Frontend polls these (1 s interval is fine for internal round):

| Endpoint | Returns |
|----------|---------|
| `GET /api/device/status` | CPU, RAM, status, streaming flag |
| `GET /api/session/current` | Active audio session |
| `GET /api/voice/latest` | Last transcript + intent + action |
| `GET /api/metrics` | Aggregate wake events, bytes, latency |
| `GET /health` | `{ "status": "ok" }` |

---

## Local test without ESP32

```bash
cd backend
python scripts/simulate_device.py
curl http://localhost:8000/api/voice/latest
```
