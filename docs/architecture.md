# Edge Voice Activation System — Architecture

## Overview

The Edge Voice Activation System is an open-source edge voice stack that enables always-on keyword detection on a low-power device, with post-wake-word audio streaming to a Python backend for ASR and a real-time frontend dashboard.

## System Flow

```text
ESP32 / Edge Device
    │
    ├── UDP :8766  (telemetry every 1s)
    └── TCP :8765  (PCM audio after wake)
            │
            ▼
Python Backend (FastAPI)
    │
    ├── Device State Manager
    ├── Audio Session → WAV → ASR
    ├── Voice Intent Engine → Action
    │
    │ REST API :8000
    ▼
Frontend Dashboard (Next.js)
```

## Components

### Edge Device (Embedded — future)

- I2S microphone input, DMA audio buffers
- Lightweight on-device KWS model
- Streams binary PCM audio only after wake word detection
- Sends telemetry (CPU, RAM, inference time, etc.)

### Backend (`backend/`)

| Module | Purpose |
|--------|---------|
| `core/` | Config, central device state |
| `network/` | UDP telemetry + TCP audio servers |
| `audio/` | Session manager, PCM buffer, WAV export |
| `asr/` | Pluggable ASR (mock / Whisper) |
| `intent/` | Fuzzy intent matching + action router |
| `api/` | REST endpoints for frontend |

**Network ports:**

- UDP **8766** — Edge device telemetry
- TCP **8765** — Framed PCM audio stream
- HTTP **8000** — REST API

See [esp32-protocol.md](esp32-protocol.md) for packet formats.

### Frontend (`frontend/`)

| Area | Purpose |
|------|---------|
| `components/dashboard/` | Live dashboard panels (future) |
| `components/device/` | Device connection status (future) |
| `components/audio/` | Streaming and transcript UI (future) |
| `components/metrics/` | Performance charts (future) |
| `lib/api.ts` | REST client for backend |
| `lib/websocket.ts` | WebSocket client abstraction |
| `hooks/` | React hooks for device state and WebSocket |
| `types/` | TypeScript event and data contracts |

## Event Protocol (planned)

Events exchanged between backend and clients:

```text
device_connected / device_disconnected
kws_listening / wake_word_detected
stream_started / audio_chunk / stream_ended
asr_processing / partial_transcript / final_transcript
metrics_updated
```

Type definitions exist in both `frontend/types/` and `backend/app/schemas/` as placeholders.

## Design Principles

1. **Edge-first latency** — KWS runs locally; audio is streamed only after detection
2. **Modular monorepo** — Frontend, backend, and embedded teams work independently
3. **No premature complexity** — No message queues, Redis, or microservices at this stage
4. **Shared contracts** — Event types defined in both TypeScript and Python for consistency

## Current State

This repository contains the **project skeleton only**:

- Backend: health check, CORS, WebSocket connect/disconnect lifecycle
- Frontend: Next.js + Tailwind + shadcn/ui scaffold with folder structure and type stubs
- No KWS, ASR, audio processing, or dashboard UI implemented yet
