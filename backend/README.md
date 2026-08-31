# VoiceCore Backend

FastAPI server for the Edge Voice Activation System.

## Quick Start

```bash
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Endpoints

| Route | Type | Description |
|-------|------|-------------|
| `GET /health` | REST | Health check |
| `GET /api/devices` | REST | Device list (placeholder) |
| `/ws/device` | WebSocket | Edge device audio + telemetry |
| `/ws/dashboard` | WebSocket | Frontend real-time events |

## Module Layout

```text
app/
├── main.py              Application entry point
├── api/                 REST routers
├── websocket/           WebSocket handlers
├── services/            Business logic (placeholders)
├── schemas/             Pydantic models / event contracts
└── core/                Configuration
```
