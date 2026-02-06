# Quickstart: Main UI - Home Page & Navigation Bar

**Phase**: Phase 1 - Design & Contracts  
**Created**: February 6, 2026  
**Feature**: Main UI - Home Page & Navigation Bar  
**Branch**: `001-home-page-nav`

---

## Overview

This guide helps you get the MealPrepper home page and navigation UI up and running locally. The feature builds on existing infrastructure with minimal setup.

---

## Prerequisites

- Node.js 18+ and Bun runtime (`bun` command available)
- Docker and Docker Compose
- Git (for branch management)
- VS Code or preferred TypeScript editor

**Verify Setup**:
```bash
node --version          # Should be v18+
bun --version          # Should be installed
docker --version       # Should be installed
docker-compose --version  # Should be installed
```

---

## Local Development Setup

### 1. Clone Repository & Switch Branch

```bash
cd d:\Projecten_Thuis\mealprepper

# Already on feature branch, but verify:
git branch --show-current
# Should output: 001-home-page-nav

# Ensure latest code
git fetch origin
git pull origin 001-home-page-nav
```

### 2. Start Local Services (Docker Compose)

```bash
# From repository root:
docker compose up --build

# Or with hot reload (recommended):
docker compose watch
```

**Services Started**:
- Backend FastAPI: `http://localhost:8000`
- Frontend React (Vite): `http://localhost:5173`
- PostgreSQL Database: `localhost:5432`
- Mailcatcher: `http://localhost:1080`

**Logs**:
```bash
# In separate terminal:
docker compose logs -f frontend
docker compose logs -f backend
```

### 3. Verify Authentication Works

1. Open `http://localhost:5173` in browser
2. Sign up with test account:
   - Email: `test@example.com`
   - Password: `testpass123`
3. You should see Dashboard home page with sidebar navigation
4. If redirected to login, authentication system is working

---

## Feature File Structure

```
frontend/src/
├── routes/
│   ├── _layout.tsx                    # ✅ Authenticated layout wrapper
│   ├── __root.tsx                     # ✅ Root route
│   └── _layout/
│       ├── index.tsx                  # 📝 Dashboard (enhance)
│       ├── items.tsx                  # ✅ Existing
│       ├── settings.tsx               # ✅ Existing
│       ├── admin.tsx                  # ✅ Existing
│       ├── recipes.tsx                # 🆕 Create (placeholder)
│       ├── meal-plans.tsx             # 🆕 Create (placeholder)
│       └── shopping-list.tsx          # 🆕 Create (placeholder)
└── components/
    ├── Sidebar/
    │   ├── AppSidebar.tsx             # ✅ Main sidebar
    │   ├── Main.tsx                   # 📝 Navigation items (update)
    │   └── User.tsx                   # ✅ User menu + logout
    └── Common/
        ├── QuickActionCard.tsx        # 🆕 Create (new)
        └── [other components]

Legend:
✅ = Ready to use
📝 = Needs enhancement
🆕 = Create new
```

---

## Key Components to Modify

### 1. Dashboard Enhanced (High Priority)

**File**: `frontend/src/routes/_layout/index.tsx`

**Current State**:
```tsx
function Dashboard() {
  const { user: currentUser } = useAuth()

  return (
    <div>
      <h1>{currentUser?.full_name} 👋</h1>
      <p>Welcome back...</p>
    </div>
  )
}
```

**Enhancements Needed**:
1. ✅ Keep personalized greeting (working)
2. 📝 Add quick action cards section
3. 📝 Improve layout with grid/flexbox
4. 📝 Add styling with Tailwind CSS
5. 📝 Add empty state for new users (optional)

### 2. Navigation Items (Medium Priority)

**File**: `frontend/src/components/Sidebar/Main.tsx`

**Current State**:
```tsx
const baseItems: Item[] = [
  { icon: Home, title: "Dashboard", path: "/" },
  { icon: Briefcase, title: "Items", path: "/items" },
]
```

**Enhancement**:
```tsx
const baseItems: Item[] = [
  { icon: Home, title: "Dashboard", path: "/" },
  { icon: Briefcase, title: "Items", path: "/items" },
  { icon: ChefHat, title: "Recipes", path: "/recipes" },  // NEW
  { icon: Calendar, title: "Meal Plans", path: "/meal-plans" }, // NEW
  { icon: ShoppingCart, title: "Shopping List", path: "/shopping-list" }, // NEW
  { icon: Settings, title: "Settings", path: "/settings" },
]
```

### 3. Create Missing Routes (Medium Priority)

Simple placeholder route files:

**File**: `frontend/src/routes/_layout/recipes.tsx`
```tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/recipes")({
  component: Recipes,
  head: () => ({
    meta: [{ title: "Recipes - MealPrepper" }],
  }),
})

function Recipes() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Recipes</h1>
      <p className="text-muted-foreground">Recipe management coming soon...</p>
    </div>
  )
}
```

**Repeat for**:
- `meal-plans.tsx`
- `shopping-list.tsx`

### 4. Quick Action Card Component (Optional Enhancement)

**File**: `frontend/src/components/Common/QuickActionCard.tsx` (create new)

```tsx
import { LucideIcon } from "lucide-react"
import { Link as RouterLink } from "@tanstack/react-router"

interface QuickActionCardProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel: string
  href: string
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  href,
}: QuickActionCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Icon className="h-8 w-8 text-primary mt-1" />
          <div>
            <h3 className="font-semibold">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      <RouterLink to={href}>
        <button className="mt-4 text-sm font-medium text-primary">
          {actionLabel} →
        </button>
      </RouterLink>
    </div>
  )
}
```

---

## Development Workflow

### 1. Start Development Server

```bash
# Terminal 1: Run Docker containers
docker compose watch

# Terminal 2: Watch frontend code
cd frontend
bun run dev

# Terminal 3: Check logs if needed
docker compose logs -f frontend
```

### 2. Edit Features

Make changes to TypeScript/React files. Vite hot reload applies changes instantly.

### 3. Run Tests (Playwright E2E)

```bash
# Test navigation flows
cd frontend
bun run test

# Or specific test:
bun run test -- tests/login.spec.ts

# Watch mode (recommended):
bun run test -- --watch
```

### 4. Check Linting & Formatting

```bash
# Frontend
cd frontend
bun run lint         # Check linting errors
biome check --write  # Auto-fix formatting

# Backend (if modified)
cd backend
bash scripts/format.sh
bash scripts/lint.sh
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: enhance dashboard and add recipe/meal-plan/shopping-list navigation"
git push origin 001-home-page-nav
```

---

## Testing Checklist

### Manual Testing (Browser)

- [ ] Load `http://localhost:5173` and sign in
- [ ] See Dashboard with greeting and quick actions
- [ ] Click sidebar links (Dashboard, Items, Recipes, Meal Plans, Shopping List)
- [ ] Verify each link navigates correctly
- [ ] Check mobile view: hamburger menu appears on narrow screen
- [ ] Verify hamburger menu opens/closes
- [ ] Click user avatar in sidebar footer
- [ ] See user menu with Settings and Logout
- [ ] Click Settings and verify navigation
- [ ] Click Logout and verify redirected to login
- [ ] Check responsive design on tablet size (≥768px and <1024px)
- [ ] Check responsive design on desktop (≥1024px)

### E2E Testing (Playwright)

Create test file: `frontend/tests/home-page.spec.ts`

```typescript
import { test, expect } from "@playwright/test"

test("navigates to home page when logged in", async ({ page }) => {
  // Login first
  await page.goto("http://localhost:5173/login")
  await page.fill('input[type="email"]', "test@example.com")
  await page.fill('input[type="password"]', "testpass123")
  await page.click('button:has-text("Log In")')
  
  // Verify dashboard loads
  await expect(page.locator("h1")).toContainText("Hi,")
  await expect(page.locator("text=Welcome back")).toBeVisible()
})

test("navigation items are clickable", async ({ page }) => {
  await page.goto("http://localhost:5173")
  
  // Click each nav item
  await page.click('a:has-text("Items")')
  await expect(page).toHaveURL("/items")
  
  await page.click('a:has-text("Recipes")')
  await expect(page).toHaveURL("/recipes")
})

test("responsive hamburger menu on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("http://localhost:5173")
  
  // Hamburger should be visible
  const hamburger = page.locator('button[aria-label*="menu" i]')
  await expect(hamburger).toBeVisible()
  
  // Click to open
  await hamburger.click()
  
  // Nav should be accessible
  await expect(page.locator('nav')).toBeVisible()
})
```

Run with:
```bash
cd frontend
bun run test
```

---

## Common Issues & Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173 already in use | Kill process: `lsof -ti:5173 \| xargs kill -9` (Linux/Mac) or use Docker |
| Dashboard blank after login | Check useAuth() hook returns user object; verify token in localStorage |
| Navigation items don't appear | Check AppSidebar imports and baseItems array in Main.tsx |
| Hamburger menu doesn't close on mobile | Verify setOpenMobile() is called in Main.tsx navigation handler |
| Routes don't resolve (404) | Ensure route files exist in `_layout/` folder with correct names |
| Styling looks broken | Run `bun install` in frontend directory; check Tailwind CSS config |
| Playwright tests fail | Clear cache: `rm -rf frontend/.playwright/*`; reinstall: `bun install` |

---

## Development Tips

1. **Use React DevTools**: Install browser extension to inspect component state
2. **Check TypeScript errors**: VS Code should show them; also run `tsc --noEmit`
3. **Inspect network requests**: Browser DevTools Network tab shows API calls
4. **Test accessibility**: Use Chrome DevTools → Lighthouse → Accessibility
5. **Mobile testing**: Use browser DevTools device emulation or test with real phone

---

## Code Style Requirements

### Before Committing

```bash
# 1. Format code
biome check --write ./frontend/src

# 2. Check types
cd frontend && tsc --noEmit

# 3. Run tests
bun run test

# 4. Verify no linting errors
biome check ./frontend/src
```

### Follow Existing Patterns

- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Icons**: Lucide React
- **Routing**: TanStack Router file-based approach
- **Type Safety**: TypeScript with strict mode enabled

---

## Resources & Documentation

- **Spec**: [spec.md](spec.md) - Feature requirements
- **Data Model**: [data-model.md](data-model.md) - Component structure
- **API Contracts**: [contracts/api.md](contracts/api.md) - API expectations
- **Copilot Instructions**: [.github/copilot-instructions.md](../../.github/copilot-instructions.md) - Architecture guide
- **Frontend README**: [frontend/README.md](../../frontend/README.md)
- **Backend README**: [backend/README.md](../../backend/README.md)

---

## Next Steps

1. ✅ [Phase 0 - Research](research.md): Complete
2. ✅ [Phase 1 - Design](data-model.md) & [Contracts](contracts/api.md): Complete
3. 📋 [Phase 2 - Implementation Planning](../../.specify/templates/tasks-template.md): Use `/speckit.tasks` command

To generate implementation tasks:
```bash
.\.specify\scripts\powershell\setup-tasks.ps1
```

---

## Questions?

Refer to [GitHub Copilot Instructions](.github/copilot-instructions.md) or open an issue on the project repository.

---

**Quickstart Status**: ✅ READY FOR DEVELOPMENT  
**Last Updated**: February 6, 2026
