# Implementation Plan: Main UI - Home Page & Navigation Bar

**Branch**: `001-home-page-nav` | **Date**: February 6, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-home-page-nav/spec.md`

## Summary

Create a unified home page and navigation system for MealPrepper that provides users with an intuitive entry point after authentication. The implementation will enhance the existing Sidebar-based navigation with responsive design, add a feature-rich home page (Dashboard) with quick action buttons and summary cards, and ensure complete accessibility compliance. Core features include an authenticated layout with persistent navigation, user profile menu with logout, responsive hamburger menu on mobile, and a welcoming dashboard offering quick access to key features (Recipes, Meal Plans, Shopping List).

**Approach**: Build on existing React/TanStack Router foundation (`frontend/src/routes/_layout/*`). Enhance Dashboard component at `/_layout/index.tsx` with summary cards and CTAs. Add missing navigation routes for Recipes and Meal Plans. Verify responsive design with Tailwind breakpoints. Add ARIA labels and keyboard navigation support.

## Technical Context

**Language/Version**: TypeScript 5.3+, React 19.1.1, Node.js 18+  
**Primary Dependencies**: TanStack Router 1.158.1, Tailwind CSS 4.1.17, Radix UI components, Lucide React 0.562.0  
**Testing**: Playwright (frontend E2E tests), pytest (backend integration tests)  
**Target Platform**: Web application - responsive browser-based UI  
**Project Type**: Full-stack web (FastAPI backend + React frontend)  
**Performance Goals**: Home page load <2 seconds, navigation response <100ms, WCAG 2.1 AA compliance  
**Constraints**: Mobile-first responsive (320px+), cross-browser compatibility (Chrome, Firefox, Safari, Edge)  
**Scale/Scope**: 5+ main navigation items, responsive design with sidebar+hamburger menu for mobile

## Constitution Check

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

✅ **Principle I - API-Driven Architecture**: 
- No direct data access needed for UI feature (navigation/dashboard only display existing user data via existing API)
- **Status**: PASS - Feature is pure UI layer

✅ **Principle II - Model/DTO Separation**: 
- Uses existing User DTO from authentication system
- No new models required; reuses generated API client
- **Status**: PASS - No schema violations

✅ **Principle III - Test-Driven Development**: 
- Will require Playwright E2E tests for navigation flows and responsive design
- Can begin with contract tests for navigation structure
- **Status**: PASS - Tests will follow TDD pattern

✅ **Principle IV - Code Style & Linting**: 
- Will follow `frontend/biome.json` and `frontend/tsconfig.json` rules
- Must run `biome check --apply` before commit
- **Status**: PASS - Will enforce linting

✅ **Principle V - Centralized Data Access**:
- Dashboard uses existing API endpoints via generated client
- No new CRUD required; only UI/routing
- **Status**: PASS - No new data access patterns

**Constitution Compliance**: ✅ APPROVED - Feature aligns with all core principles

## Project Structure

### Documentation (this feature)
```
specs/001-home-page-nav/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file (CURRENT)
├── research.md          # Phase 0 (TO DO)
├── data-model.md        # Phase 1 (TO DO)
├── contracts/           # Phase 1 (TO DO)
├── quickstart.md        # Phase 1 (TO DO)
└── checklists/
    └── requirements.md  # Completed
```

### Source Code (fast-growing web app)
```
frontend/
├── src/
│   ├── routes/
│   │   ├── _layout.tsx              # Authenticated layout (EXISTS - enhance)
│   │   ├── __root.tsx               # Root route (EXISTS)
│   │   └── _layout/
│   │       ├── index.tsx             # Dashboard/home (EXISTS - enhance)
│   │       ├── items.tsx             # Items page (EXISTS)
│   │       ├── settings.tsx          # Settings page (EXISTS)
│   │       └── admin.tsx             # Admin page (EXISTS)
│   └── components/
│       ├── Sidebar/
│       │   ├── AppSidebar.tsx        # Main sidebar (EXISTS - may enhance)
│       │   ├── Main.tsx              # Navigation items (EXISTS - add Recipes/Meal Plans)
│       │   └── User.tsx              # Profile menu (EXISTS - verify logout)
│       └── Common/
│           └── [other components]
├── tests/
│   ├── login.spec.ts                # E2E tests (EXISTS)
│   └── [other tests]
└── [vite config, package.json, etc.]

backend/
├── app/
│   ├── api/
│   │   └── routes/                  # API endpoints (EXISTING - no changes)
│   ├── models/                      # Data models (EXISTING - no changes)
│   └── crud.py                      # Data access (EXISTING - no changes)
```

**Structure Decision**: Building on **Option 2: Web application** (full-stack). Enhancement of existing frontend/backend structure. No new backend endpoints required. Frontend-focused changes to routes and components.

## Complexity Tracking

No constitutional violations requiring justification. Feature is pure UI enhancement on existing architecture.

## Next Steps

**Phase 0 (Research & Clarification)**: Resolve any unknowns about:
- Visual design guidelines for dashboard cards (colors, layout)
- Specific quick actions/summary metrics to display on dashboard
- API endpoints available for fetching meal prep status data

**Phase 1 (Design & Contracts)**: 
- Create data-model.md defining Dashboard state requirements
- Create contracts/ with API contract expectations
- Design component hierarchy for enhanced Dashboard
- Create quickstart.md for development setup

**Phase 2 (Implementation Planning)**: 
- Break down into Playwright E2E tests for navigation flows
- Component implementation order
- Responsive design breakpoints and testing strategy
