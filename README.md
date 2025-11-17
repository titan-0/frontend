# Open Positions Frontend (React + Vite + Tailwind)

A modern, responsive UI for your Open Positions app.

## Features
- React 18 + Vite for fast dev and production builds
- Tailwind CSS for utility-first styling
- Positions table with selection + bulk exit
- Place Order form with alias dropdown
- API layer with dev proxy to FastAPI backend

## Prerequisites
- Node.js 18+
- FastAPI backend running locally (default: http://localhost:8000)

## Development

From PowerShell in the `frontend` folder:

```powershell
npm install
$env:VITE_BACKEND_URL = "http://localhost:8000"; npm run dev
```

Open the URL printed by Vite (default: http://localhost:5173).

The dev server proxies `"/api"` to your backend. For example, the UI calls `GET /api/positions_json` which is proxied to `http://localhost:8000/positions_json`.

## Build

```powershell
npm run build
```

This outputs the static site to `frontend/dist`. You can serve it with:

```powershell
npm run preview
```

Or integrate with the FastAPI app by serving `dist` as static files if desired.

## Configure API base
- Default dev proxy targets `http://localhost:8000`.
- You can override with `VITE_BACKEND_URL` env var.
- In production, set `VITE_API_BASE` to a full URL (e.g., `https://your-domain/api`) and ensure your reverse proxy routes `/api` to the backend.

## Backend endpoints expected
- `GET /positions_json` → array of open positions
- `GET /aliases` → array of alias strings
- `POST /place_order` → places a new order (JSON payload)
- `POST /exit_position` → exits one or more positions (payload: `{ orders: [{ order_id }] }`)

If `GET /positions_json` is missing, I can add it to `open_positions_app/main.py`.
