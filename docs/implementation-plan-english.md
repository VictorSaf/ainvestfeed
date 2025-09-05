# aInvestFeed Implementation Plan (Small and Efficient Steps)

## Principles

- Each step produces incremental value and is tested (unit, integration, e2e where appropriate).
- No feature enters "completed" status without verified acceptance criteria and passing automated tests.
- Respect the stack and specifications from existing documentation in `docs/`.

## Definition of "Done" for a Step

- Code + configuration + migrations (if applicable)
- Relevant automated tests passing (and in CI)
- Briefly documented in `docs/implementation-status.md`

## Step Notation: P0, P1, ... (recommended execution order)

---

## P0 – Minimal Backend Scaffold + Health Check

- **Objective**: Quick API service startup with TypeScript, Express, Jest, ESLint, Prettier, dotenv, Winston, `GET /health`.
- **Implementation**:
  - Initialize Node.js 20 + TS project, `src/` structures (controllers, services, middlewares, config).
  - Config: ESLint, Prettier, tsconfig, npm scripts, dotenv with validation.
  - Winston logger, request-id, standard JSON error handler.
  - Endpoint `GET /health` with status and version.
- **Tests**:
  - Unit: utilities (config validation), error handler, logger wrapper.
  - Integration: `GET /health` (200, expected payload, <200ms local).
- **Acceptance Criteria**: server starts locally, `GET /health` returns 200 stable; lint + unit + integration passing in CI.

## P1 – Initial CI (Lint + Test) and Code Quality

- **Objective**: Automatic runs on branches; blocks on lint/test errors.
- **Implementation**:
  - Minimal GitHub Actions workflow (Node 20, npm ci, lint, test:ci).
- **Tests**: workflow runs green on commit.
- **Acceptance Criteria**: verify in Actions tab; optional badge.

## P2 – PostgreSQL + TypeORM Setup + Base Migrations (Users, UserSessions)

- **Objective**: DB connection, reproducible migrations, first tables.
- **Implementation**:
  - TypeORM config (env), scripts `db:migrate`, `db:revert`.
  - Entities: `User`, `UserSession` according to documentation schema (minimal MVP version).
- **Tests**:
  - Integration: run migrations on test DB; minimal CRUD on `User`.
- **Acceptance Criteria**: migrations run without errors; integration tests passing.

## P3 – MVP Authentication (Register, Login, Refresh, Logout) + Basic RBAC

- **Objective**: Complete JWT flow (short-lived) + refresh token, bcrypt passwords, roles (user, admin).
- **Implementation**:
  - Endpoints: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`.
  - Bcrypt, salting, session/refresh storage in DB (hash), `auth` + `requireRole` middleware.
  - Rate limiting on `/auth/*` per docs.
- **Tests**:
  - Unit: auth services, hash, token.
  - Integration: full lifecycle (register → login → protected → refresh → logout).
- **Acceptance Criteria**: standard scenarios + common errors (wrong password, invalid token) covered.

## P4 – User Profile + Minimal Preferences

- **Objective**: endpoints `/user/profile` (GET/PUT) with basic preferences (language, timezone).
- **Implementation**: controller, service, validations.
- **Tests**: integration GET/PUT, field validations.
- **Criteria**: profile update and persistence, protected by auth.

## P5 – News Ingestion Skeleton (RSS) + Content Hash Deduplication

- **Objective**: minimal news ingestion pipeline (RSS) and `news` storage.
- **Implementation**:
  - Tables `news`, `scraping_configs`, `scraping_runs` (minimum required).
  - Worker (cron/queue) reading RSS, cleaning content, calculating `content_hash`, skipping duplicates.
- **Tests**:
  - Unit: hashing, normalization, dedup.
  - Integration: ingestion job on mock feed.
- **Criteria**: ingestion runs create unique rows, no duplicates, predictable timing.

## P6 – News Feed Endpoints (GET /news, /news/:id) with Pagination and Basic Filters

- **Objective**: deliver feed per `api-specification.md` (MVP subset: pagination, market, confidence_min dummy until AI).
- **Implementation**: optimized query, key indexes; mapped response model.
- **Tests**: integration on seeded DB, response contracts.
- **Criteria**: response time <200ms in 95% local; correct pagination.

## P7 – Minimal AI Integration (Summarizer) via Ollama (or Configurable Stub)

- **Objective**: `analysis_summary` for new news, latched via worker.
- **Implementation**: Ollama service with timeout, prompt templating; persist summary.
- **Tests**: unit with stub; integration with real service if available (flag in CI: skip).
- **Criteria**: summary generated for new news; retry and fallback.

## P8 – Analyzer (BUY/SELL/HOLD) + `analysis_detail` (MVP)

- **Objective**: recommendation + confidence, short reasoning.
- **Implementation**: second agent; orchestration after summary; save to DB.
- **Tests**: unit on mapping; end-to-end integration (ingest → summary → analysis → feed includes short analysis).
- **Criteria**: analyses generated for >90% eligible news; errors don't block pipeline.

## P9 – Observability: Extended /health, Metrics (Prometheus) and Sentry

- **Objective**: health includes DB/Redis/Ollama; expose /metrics; Sentry initialized.
- **Tests**: integration /health; unit on collectors.
- **Criteria**: endpoints exposed, dashboards configurable later.

## P10 – Frontend Web Scaffolding (React + Vite + Tailwind) + Login + Read-only Feed

- **Objective**: minimal UI authentication + news list with infinite scroll, mobile-first.
- **Implementation**: routes, React Query, card components; basic theming.
- **Tests**: component + e2e (Playwright) for login and listing.
- **Criteria**: functional login, displayed feed, infinite scroll.

## P11 – Docker Compose Dev + Backend/Frontend Dockerfiles + Smoke Tests

- **Objective**: unified local run (API, DB, Redis, Ollama, frontend).
- **Implementation**: compose + healthchecks; multi-stage Dockerfiles.
- **Tests**: smoke: `curl /health`, UI opens, basic flow.
- **Criteria**: `docker compose up` starts everything; health green.

## P12 – Web Security: Helmet, CORS, API Rate Limiting

- **Objective**: initial hardening per docs.
- **Implementation**: middleware + configurable per environment.
- **Tests**: headers present; rate limit on auth reaches 429 on overflow.
- **Criteria**: checks pass in integration.

## P13 – Bookmarks + User Activity Tracking (MVP)

- **Objective**: POST /news/:id/bookmark; GET /user/bookmarks; log events.
- **Implementation**: tables/endpoints; invalidate user feed cache.
- **Tests**: integration + e2e UI bookmark/unbookmark.
- **Criteria**: stable, idempotent behavior.

## P14 – Simple Search (LIKE/TSV) on Title + Content_clean

- **Objective**: GET /search (MVP subset: q, type=news).
- **Implementation**: tsvector indexes, query; input sanitization.
- **Tests**: minimal relevance integration.
- **Criteria**: response under 200ms on small dataset; consistent results.

## P15 – Notifications: Backend Skeleton + Device Registration (Mobile-ready)

- **Objective**: POST /mobile/devices, notification model, delivery queue.
- **Implementation**: entities, endpoint, stub template service.
- **Tests**: endpoint integration; unit on template.
- **Criteria**: device URIs stored correctly; no duplicates.

## P16 – Initial DB Optimizations (Key Indexes) + API-level DataLoader/Cache

- **Objective**: stability and reduced latency for feed/analyses.
- **Implementation**: indexes from docs; LRU + Redis for feed response caching.
- **Tests**: simple profiling; unit on cache policy.
- **Criteria**: p95 improvement; no visible regression.

## P17 – Extended E2E Suite (Playwright) + Performance Baseline (Lighthouse/K6)

- **Objective**: critical flow coverage + initial thresholds.
- **Implementation**: scenarios news feed, filtering, detail, bookmark; K6 for /news.
- **Tests**: run in CI; p(95) thresholds defined.
- **Criteria**: all e2e passing; thresholds met on staging/local.

---

## Notes

- Extensions (watchlists, advanced analytics, complete mobile app) are added after MVP stabilization (P0–P12).
- For AI in CI, use stub/fake and run "real model" tests only in controlled environments.
