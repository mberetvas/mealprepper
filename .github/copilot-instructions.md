# GitHub Copilot Instructions

These instructions help AI agents and contributors work productively with this FastAPI + React codebase.

## Project at a glance
- **Backend**: FastAPI + SQLModel (see `backend/app/models/` and `backend/app/crud.py`).
- **Frontend**: TypeScript + React (Bun runtime), auto-generated API client in `frontend/src/client`.
- **Infra**: Docker Compose + Traefik + Mailcatcher (see `compose.yml`, `compose.override.yml`, `compose.traefik.yml`).

## Code Style
- **Python**: follow `pyproject.toml` tooling and use `backend/scripts/format.sh` / `backend/scripts/lint.sh`.
- **Frontend**: project uses Biome / TypeScript rules (see `biome.json`, `tsconfig.json` and `frontend/vite.config.ts`).
- **When editing**: keep existing patterns (Pydantic/SQLModel model classes, separate `Create`/`Update`/`Public` schemas in `backend/app/models/`).

## Architecture
- **API-driven:** backend exposes OpenAPI; frontend uses generated client in `frontend/src/client` (run `scripts/generate-client.sh` after API changes).
- **Auth:** OAuth2 password flow with Bearer token. Key files: `backend/app/models/auth.py`, `backend/app/core/security.py`, and `frontend/src/hooks/useAuth.ts`.
- **DB & Migrations:** models live in `backend/app/models/`; migrations under `backend/app/alembic/versions/` and managed via Alembic.

## Build & Test (commands you can run)
- **Start local stack (dev):** `docker compose watch` (hot reload for backend/frontend).
- **Build & up:** `docker compose up --build`.
- **Generate frontend client:** `bash scripts/generate-client.sh` (run after backend API changes).
- **Backend tests:** `bash backend/scripts/test.sh` or `bash scripts/test.sh` from repo root (runs pytest fixtures in `tests/`).
- **Frontend tests:** Playwright tests in `frontend/tests` (see `frontend/package.json` / `playwright.config.ts`).

## Project Conventions (important, non-standard patterns)
- **Models/DTOs:** each DB table model uses separate request/response classes — follow `backend/app/models/user.py` as example.
- **CRUD layer:** database access is centralized in `backend/app/crud.py` (avoid direct DB in route handlers).
- **Routes vs. services:** keep route handlers thin and delegate logic to `crud` or `backend/app/lib/` helpers (see `backend/app/lib/recipe_scraper.py`).
- **Frontend routing:** file-based TanStack Router in `frontend/src/routes` — `__root.tsx` and `_layout.tsx` define app shell.

## Integration Points
- **Client generation:** `scripts/generate-client.sh` writes into `frontend/src/client` — update when OpenAPI changes.
- **Env & secrets:** compose files and `backend/app/core/config.py` control runtime configuration. Avoid committing secrets.
- **External services:** Traefik (reverse proxy), Postgres DB, Mailcatcher used in local dev (compose files list services).

## Security
- **Sensitive code paths:** authentication (see `backend/app/models/auth.py` and `backend/app/core/security.py`) and `backend/app/api/deps.py` (current user/session handling).
- **Tokens:** frontend stores bearer token in `localStorage` via `OpenAPI.TOKEN` in `frontend/src/main.tsx` — treat this as sensitive when testing.

## If you change the API
1. Update backend implementation and tests.
2. Run backend tests: `bash backend/scripts/test.sh`.
3. Regenerate the client: `bash scripts/generate-client.sh`.
4. Run frontend dev server or Playwright tests.

## Where to look for examples
- Backend model pattern: `backend/app/models/user.py`.
- CRUD usage: `backend/app/crud.py` and tests under `backend/tests/` and `tests/crud/`.
- Frontend client usage: `frontend/src/hooks/useAuth.ts` and components under `frontend/src/components`.

---
If any section is unclear or you want more detail (scripts, run examples, or CI notes), tell me which area to expand.