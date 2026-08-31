# Edge Voice Activation System (VoiceCore)

An SIH hardware + AI project for edge-based keyword spotting with cloud ASR and a real-time monitoring dashboard.

## Architecture

```text
Edge Device → WebSocket (/ws/device) → Python Backend → WebSocket (/ws/dashboard) → Frontend Dashboard
```

See [docs/architecture.md](docs/architecture.md) for full system design.

## Repository Structure

```text
VoiceCore/
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

Project skeleton only — health check, WebSocket lifecycle, shared type contracts, and folder structure are in place. No KWS, ASR, or dashboard features implemented yet.
