# AnuVanni Backend

FastAPI server for edge voice activation: UDP telemetry, TCP audio, ASR, and voice intent.

## Architecture

```text
ESP32 ── UDP :8766 ──► Telemetry
ESP32 ── TCP :8765 ──► Audio (PCM16)
Next.js ── HTTP :8000 ──► REST API
```

See [../docs/esp32-protocol.md](../docs/esp32-protocol.md) for the ESP32 packet contract.

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

Optional `.env`:

```env
CORS_ORIGINS=http://localhost:3000
ASR_PROVIDER=mock              # mock | whisper
UDP_TELEMETRY_PORT=8766
TCP_AUDIO_PORT=8765
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

On startup the backend opens:
- **REST** on port 8000
- **UDP telemetry** on port 8766
- **TCP audio** on port 8765

## Test without hardware

With the server running:

```bash
python scripts/simulate_device.py
curl http://localhost:8000/api/device/status
curl http://localhost:8000/api/voice/latest
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/device/status` | Live device state |
| GET | `/api/session/current` | Active audio session |
| GET | `/api/voice/latest` | Last transcript + intent |
| GET | `/api/metrics` | Aggregate stats |

## Module layout

```text
app/
├── core/          config, device_state
├── network/       udp_telemetry, tcp_audio, protocols
├── audio/         session manager, PCM buffer, WAV
├── asr/           ASR service (mock or Whisper)
├── intent/        fuzzy intent matcher + action router
└── api/           REST routes
```

## ASR providers

- **mock** (default): Returns demo transcripts for pipeline testing
- **whisper**: Requires `pip install faster-whisper`

```env
ASR_PROVIDER=whisper
WHISPER_MODEL=base
```
