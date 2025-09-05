# aInvestFeed

Backend (Express + TypeORM + Postgres) and Frontend (Vite + React) with tests, E2E, and CI.

## Quick start (Docker Compose)

- Backend API: 3002
- Postgres: 5434
- Frontend preview: 5174

```
# Start infra and backend
docker compose up -d postgres redis backend

# Check health
curl http://localhost:3002/health

# Frontend
cd frontend
VITE_API_BASE_URL=http://localhost:3002 npm run build
npm run preview -- --port 5174 --strictPort
```

## Development backend (with seeds)

```
cd backend
NODE_ENV=development PORT=3003 DATABASE_URL=postgres://user:password@localhost:5434/ainvestfeed npm run dev
# seed example
curl -X POST http://localhost:3003/__seed/news -H 'content-type: application/json' -d '{"title":"Hello","market":"stocks"}'
```

## Tests

- Backend: `cd backend && npm ci && npm run test`
- Frontend: `cd frontend && npm ci && npm run test`
- E2E: from repo root `BASE_URL=http://localhost:5174 API_BASE_URL=http://localhost:3003 npm run e2e`

## CI

- Backend/Frontend CI, E2E, and Smoke workflow under `.github/workflows/`.

## Environment

See `backend/ENV_EXAMPLE` and `frontend/ENV_EXAMPLE`.
