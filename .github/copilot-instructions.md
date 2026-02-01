# GitHub Copilot Instructions

## Project Overview
This is a full-stack web application using **FastAPI** (Backend) and **React** (Frontend).
- **Backend**: Python, FastAPI, SQLModel (ORM), PostgreSQL, Alembic, Pydantic.
- **Frontend**: TypeScript, React, Vite, TanStack Router, TanStack Query, Tailwind CSS, Shadcn UI.
- **Infrastructure**: Docker Compose, Traefik, Mailcatcher.

## Architecture & Data Flow
- **API-Driven**: The Backend serves a REST API specified by OpenAPI.
- **Code Generation**: The Frontend API client (`frontend/src/client`) is auto-generated from the Backend's `openapi.json`.
- **Authentication**: OAuth2 Password flow (Bearer Token).
  - Frontend stores the token in `localStorage`.
  - Configured in `frontend/src/main.tsx` via `OpenAPI.TOKEN`.

## Backend Development (`backend/`)
- **Dependency Management**: Uses `uv`.
- **Database Models**: Defined in `backend/app/models.py`.
  - **Pattern**: Use separate classes for DB Tables (`table=True`), Request Payloads (`Create`, `Update`), and Response Schemas (`Public`).
  - *Example*: `User`, `UserCreate`, `UserUpdate`, `UserPublic`.
- **Dependency Injection**: Use `SessionDep` and `CurrentUser` from `backend/app/api/deps.py` for DB sessions and auth.
- **CRUD**: Put database logic in `backend/app/crud.py`, not directly in routes.
- **Migrations**: Uses Alembic (`backend/app/alembic`).
  - Run `alembic revision --autogenerate -m "message"` inside the backend container to create migrations.
- **Testing**: Uses `pytest`. Run via `bash scripts/test.sh`.

## Frontend Development (`frontend/`)
- **Runtime**: Bun.
- **Routing**: **TanStack Router** (File-based routing in `frontend/src/routes`).
  - `__root.tsx`: Root route configuration.
  - `_layout.tsx`: Layout routes (e.g., Sidebar, Navbar).
  - `index.tsx`: Corresponds to `/`.
  - `login.tsx`: Independent route.
- **Data Fetching**: **TanStack Query**.
  - Use `useQuery` for GET requests and `useMutation` for POST/PUT/DELETE.
  - *Pattern*: Pass generated service methods (e.g., `UsersService.readUsers`) as `queryFn`.
- **UI Components**: **Shadcn UI** located in `frontend/src/components/ui`.
- **Forms**: React Hook Form + Zod validation.
- **Testing**: Playwright (`frontend/tests`).

## Critical Workflows
1. **Local Development**:
   Run `docker compose watch` to start the stack with hot-reloading for both backend and frontend.

2. **Updating the API Client**:
   When backend endpoints change:
   ```bash
   bash scripts/generate-client.sh