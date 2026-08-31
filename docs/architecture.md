# Edge Voice Activation System — Architecture

## Overview

The Edge Voice Activation System is an SIH hardware + AI project that enables always-on keyword detection on an edge device, with post-wake-word audio streaming to a Python backend for ASR and a real-time frontend dashboard.

## System Flow

```text
Edge Device
    │
    │ Continuous local listening + KWS (Keyword Spotting)
    │
    │ Wake word detected
    ▼
WebSocket Audio Stream  (/ws/device)
    │
    ▼
Python Backend (FastAPI)
    │
    ├── Audio Stream Receiver
    ├── Audio Session Management
    ├── Audio Processing Pipeline
    ├── ASR Integration
    ├── Latency & Performance Metrics
    │
    │ WebSocket events  (/ws/dashboard)
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
| `api/` | REST endpoints (health, device registry) |
| `websocket/` | Real-time channels for device audio and dashboard events |
| `services/` | Business logic: audio sessions, ASR, metrics |
| `schemas/` | Pydantic models shared across API and WebSocket |
| `core/` | Configuration, shared utilities |

**WebSocket routes:**

- `/ws/device` — Edge device connects here to stream audio and send telemetry
- `/ws/dashboard` — Frontend connects here to receive real-time events and metrics

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
