<!-- 
Sync Impact Report — Constitution v1.0.0 Ratification
========================================================

BASELINE RATIFICATION (v1.0.0)
- Source: Initial adoption from project architecture review
- Date: 2026-02-06
- Principles established: 5 core principles + 2 cross-cutting sections
- Ratification: Foundational governance for MealPrepper full-stack development
- Templates reviewed: plan-template.md, spec-template.md, tasks-template.md
- Status: ✅ All dependent templates align with principles

No prior version exists; this is the initial constitution.
-->

# MealPrepper Constitution

This document defines the non-negotiable principles and practices for MealPrepper development. 
It is the source of truth for architecture decisions, code review criteria, and quality gates.

## Core Principles

### I. API-Driven Architecture
Backend exposes OpenAPI as the contract; frontend uses generated client from that contract. 
All backend changes flow through the API—no direct database access from route handlers.

**Non-negotiable rules:**
- All business logic lives in OpenAPI endpoints or the CRUD layer (`backend/app/crud.py`)
- Route handlers remain thin; delegate to `backend/app/crud.py` or `backend/app/lib/` helpers
- On API changes, regenerate frontend client (`bash scripts/generate-client.sh`) before deployment
- Database schema changes require Alembic migrations in `backend/app/alembic/versions/`

**Rationale:** Clear contracts enable teams to work independently; generated clients prevent stale API usage; migrations preserve data integrity across environments.

---

### II. Model/DTO Separation
Each database table has distinct request/response schemas. Request schemas (`Create`, `Update`) differ from response schemas (`Public`, list variants).

**Non-negotiable rules:**
- Database models live in `backend/app/models/[entity].py` with separate request/response classes
- Never return database SQLModel directly to API; always use a `Public` schema
- Sensitive fields (hashed passwords, tokens) MUST NOT appear in response schemas
- Follow the pattern in `backend/app/models/user.py` for all new models

**Rationale:** Decoupling internal representation from API contracts prevents accidental data leaks and enables safe schema evolution.

---

### III. Test-Driven Development (NON-NEGOTIABLE)
Tests are written first and must fail before implementation. Red-Green-Refactor cycle is mandatory.

**Non-negotiable rules:**
- Contract tests in `tests/contract/` for all API endpoints (validate contracts before implementation)
- Integration tests in `tests/integration/` for cross-service interactions and user journeys
- Unit tests in `tests/unit/` for isolated logic (CRUD layer, helpers, utilities)
- All tests MUST PASS before PR submission (`bash backend/scripts/test.sh` and frontend playwright tests)
- Changes to API contracts require new/updated tests before implementation
- Coverage expectations: core business logic ≥80%, utilities ≥70%, infrastructure helpers ≥60%

**Rationale:** TDD catches design flaws early, documents expected behavior, and prevents regressions.

---

### IV. Code Style & Linting (Enforced)
Consistent formatting and static analysis prevent merge conflicts and maintain readability.

**Non-negotiable rules:**
- **Python backend:** Run `bash backend/scripts/format.sh` before commit; linting via `bash backend/scripts/lint.sh`
  - Follow `backend/pyproject.toml` tooling configuration (Ruff, mypy, etc.)
- **TypeScript/React frontend:** Run `biome check --apply` on `frontend/src/` before commit; TypeScript in strict mode
  - Follow `frontend/tsconfig.json` and `frontend/biome.json` rules
- **All PRs must pass CI:** Linting, formatting, and type-checking errors block merge
- Disable rules only with explicit comments explaining why (e.g., `# noqa: E501` with justification)

**Rationale:** Automated tooling removes bikeshedding and enables fast code review focused on logic.

---

### V. Centralized Data Access via CRUD
All database queries go through `backend/app/crud.py`. Route handlers and services call CRUD functions only.

**Non-negotiable rules:**
- No direct SQLModel queries in route handlers (`backend/app/api/routes/`)
- CRUD functions accept database session and business parameters; return domain objects or lists
- CRUD functions handle filtering, pagination, and sorting logic
- Error handling (not found, conflict) happens in CRUD layer
- Service layer (`backend/app/lib/`) calls CRUD for data access

**Rationale:** Centralizing data access prevents SQL injection, enables consistent error handling, and makes testing easier.

---

## Code Organization & Development Workflow

### Backend Structure
```
backend/
├── app/
│   ├── models/          # Database tables + request/response schemas
│   ├── crud.py          # Data access layer (database queries)
│   ├── api/
│   │   ├── deps.py      # Dependency injection (auth, session)
│   │   ├── main.py      # Router aggregation
│   │   └── routes/      # Endpoint handlers (thin, stateless)
│   ├── lib/             # Business logic helpers (recipe scraper, etc.)
│   ├── core/
│   │   ├── config.py    # Environment configuration
│   │   ├── db.py        # Database connection
│   │   └── security.py  # OAuth2, password hashing
│   └── email-templates/ # Email templates (HTML/text)
├── tests/               # Test suite (contract, integration, unit)
└── scripts/             # Automation (format, lint, test)
```

### Frontend Structure
```
frontend/
├── src/
│   ├── client/          # Auto-generated API client (DO NOT EDIT)
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom hooks (useAuth, etc.)
│   ├── routes/          # TanStack Router (file-based routing)
│   ├── lib/             # Utilities (formatters, validators)
│   └── main.tsx         # App entry point
├── tests/               # Playwright E2E tests
└── public/              # Static assets
```

**Workflow for API Changes:**
1. Update FastAPI endpoint in `backend/app/api/routes/[handler].py`
2. Update request/response models in `backend/app/models/[entity].py`
3. Run backend tests: `bash backend/scripts/test.sh`
4. Regenerate frontend client: `bash scripts/generate-client.sh`
5. Update frontend components to use new generated client types
6. Run frontend tests: `npm run test` (Playwright)
7. Verify E2E flow in browser before PR

---

## Authentication & Security

### Password Flow (OAuth2)
- Bearer tokens stored in `localStorage` by frontend (via `OpenAPI.TOKEN` in `frontend/src/main.tsx`)
- Tokens are JWT-like (signed by FastAPI); no refresh tokens yet
- Session managed by `frontend/src/hooks/useAuth.ts`

**Non-negotiable security rules:**
- Passwords hashed with bcrypt in `backend/app/core/security.py`
- Current user injected via `backend/app/api/deps.py` (dependency injection)
- All routes requiring auth use `Depends(get_current_user)` or `Depends(get_current_superuser)`
- Never log passwords, tokens, or hashed passwords
- Bearer token stored as HTTP-only cookie in production (plan for future)
- Secrets (DB passwords, API keys) stored in environment variables, never committed

**Rationale:** OAuth2 passwords flow is simple; tokens enable stateless backends; HttpOnly cookies prevent XSS token theft in production.

---

## Deployment & Infrastructure

### Local Development (Docker Compose)
```bash
docker compose watch  # Hot reload for backend/frontend
docker compose up --build  # Full build
docker compose logs [service]  # Check service logs
```

Services:
- **backend**: FastAPI at `http://localhost:8000`, docs at `http://localhost:8000/docs`
- **frontend**: React at `http://localhost:5173`
- **postgres**: Database at `localhost:5432`
- **mailcatcher**: SMTP at `localhost:1025`, web UI at `http://localhost:1080`
- **adminer**: Database admin at `http://localhost:8080`
- **traefik**: Reverse proxy at `http://localhost:8090`

### Compose Files & Configuration
- `compose.yml`: Services, networks, volumes
- `compose.override.yml`: Local overrides (volumes for hot reload)
- `compose.traefik.yml`: Traefik ingress rules (used in staging/prod)
- `.env` file: Environment overrides (DOMAIN, etc.)

**Non-negotiable rules:**
- Never commit API keys, database passwords to repo
- Use `compose.override.yml` for local secrets
- Traefik routes traffic by subdomain (production); localhost uses port mapping (local)
- All services must pass health checks before dependent services start

**Rationale:** Docker Compose ensures all developers use identical stack; Traefik enables domain-based routing for multi-environment parity.

---

## Governance

### Constitution as Source of Truth
This constitution supersedes verbal agreements, chat discussions, and past practices. 
When in doubt, code review decisions must reference the principle violated.

### Amendment Process
1. **Proposal**: Open a GitHub discussion or issue describing the change
2. **Rationale**: Include reasoning (why the current principle is insufficient)
3. **Migration Plan**: If removing/changing principle, describe impact on existing code
4. **Approval**: At least one maintainer review; consensus preferred
5. **Version Bump**: 
   - MAJOR: Principle removal or backward-incompatible redefinition
   - MINOR: New principle or significant expansion of existing
   - PATCH: Clarification, wording, non-semantic refinement
6. **Documentation**: Update `.specify/memory/constitution.md` with new version and amendment date
7. **Propagation**: Review dependent templates (`plan-template.md`, `spec-template.md`, `tasks-template.md`) for alignment

### Compliance Review
- **PR Reviews**: Checklist item "Constitution compliance" before approval
- **Before Merging**: Verify principle adherence (test-driven? centralized CRUD? proper schemas?)
- **Quarterly Audits**: (When established) Codebase scan for violations; document exemptions

### Runtime Guidance
For implementation details not covered here, refer to:
- [GitHub Copilot Instructions](.github/copilot-instructions.md) – Full-stack architecture guide
- [Contributing Guide](CONTRIBUTING.md) – PR expectations, human-led design
- [Development Guide](development.md) – How to run stack locally
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`

---

**Version**: 1.0.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-06