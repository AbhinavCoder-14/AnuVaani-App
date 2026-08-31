# Edge Voice Activation System (AnuVanni)

An open-source hardware + AI stack for edge-based keyword spotting with cloud ASR and a real-time monitoring dashboard.

## Architecture

```text
Edge Device → WebSocket (/ws/device) → Python Backend → WebSocket (/ws/dashboard) → Frontend Dashboard
```

**Current prototype** uses UDP + TCP from ESP32 and REST polling from Next.js. See [docs/esp32-protocol.md](docs/esp32-protocol.md).

See [docs/architecture.md](docs/architecture.md) for full system design.

## Repository Structure

```text
AnuVanni/
├── frontend/          Next.js dashboard (TypeScript, Tailwind, shadcn/ui)
├── backend/           FastAPI server (Python)
├── docs/              Architecture and design docs
├── docker-compose.yml Optional containerized dev environment
└── README.md
```

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- (Optional) Docker and Docker Compose

## Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file (optional — defaults work for local dev):

```env
CORS_ORIGINS=http://localhost:3000
HOST=0.0.0.0
PORT=8000
```

### Run Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Verify: [http://localhost:8000/health](http://localhost:8000/health)

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Frontend Setup

```bash
cd frontend
npm install --ignore-scripts
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### Run Frontend

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Docker (optional)

```bash
docker compose up --build
```

## Development Workstreams

| Team | Focus |
|------|-------|
| **Frontend** | Landing page, live dashboard, WebSocket UI |
| **Backend** | Audio receiver, session pipeline, ASR, metrics |
| **Embedded** | I2S, DMA, audio buffers, KWS, streaming |

## Current Status

Backend prototype implements UDP telemetry, TCP audio pipeline, mock ASR, intent engine, and REST API. Frontend dashboard still uses static demo data; wire to `/api/*` endpoints next.
