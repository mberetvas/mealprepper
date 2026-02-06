# Data Model: Main UI - Home Page & Navigation Bar

**Phase**: Phase 1 - Design & Contracts  
**Created**: February 6, 2026  
**Feature**: Main UI - Home Page & Navigation Bar  
**Branch**: `001-home-page-nav`

---

## Domain Entities

### User
**Source**: Existing entity via authentication system  
**Location**: `frontend/src/hooks/useAuth.ts` (consumed) | Backend: OpenAPI schema

**Properties**:
```typescript
interface User {
  id: UUID
  email: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
}
```

**Usage in Feature**: 
- Display in profile menu (name, email, avatar initials)
- Personalized greeting on Dashboard
- Conditional navigation items (admin section for superusers)
- Authentication guard for layout

---

### NavigationItem
**Source**: New entity (data structure, no persistence)  
**Location**: `frontend/src/components/Sidebar/Main.tsx`

**Properties**:
```typescript
interface NavigationItem {
  icon: React.ReactNode        // Lucide React icon component
  title: string               // Display label: "Dashboard", "Items", etc.
  path: string                // Route path: "/", "/items", etc.
  description?: string        // Optional: tooltip or accessible description
  badge?: string              // Optional: notification badge count
  isActive?: boolean          // Computed: true if current route matches path
  isDisabled?: boolean        // Optional: disabled state
}
```

**Navigation Item Definitions**:
| ID | Title | Path | Icon | Required | Visibility |
|---|---|---|---|---|---|
| 1 | Dashboard | / | Home | Yes | Always |
| 2 | Items | /items | Briefcase | Yes | Always |
| 3 | Recipes | /recipes | Chef Hat (future icon) | Yes | Always |
| 4 | Meal Plans | /meal-plans | Calendar | Yes | Always |
| 5 | Shopping List | /shopping-list | ShoppingCart | Yes | Always |
| 6 | Settings | /settings | Settings | Yes | Always |
| 7 | Admin | /admin | Users | No | Superuser only |

**State & Transitions**:
- All items loaded on route initialization
- Active state changes when user navigates (TanStack Router match detection)
- No persistence needed (computed from route)

---

### DashboardState
**Source**: New component state  
**Location**: `frontend/src/routes/_layout/index.tsx`

**Properties**:
```typescript
interface DashboardState {
  user: User                        // Current authenticated user
  isLoading: boolean                // Data fetch status
  error?: string                    // Error message if fetch fails
  stats?: DashboardStats           // Optional: aggregated metrics
}

interface DashboardStats {
  totalRecipes: number              // User's saved recipes count
  favoritesCount: number            // Bookmarked/favorite recipes
  itemsCount: number                // Items created/tracked
  mealPlansCount: number            // Meal plans created
  upcomingMeals: number             // Scheduled meals for next 7 days
}
```

**Initial State**:
```typescript
{
  user: currentUser,                // From useAuth() hook
  isLoading: false,                 // No async loading for MVP
  error: undefined,
  stats: undefined                  // Optional; not required for MVP
}
```

**State Transitions**:
- Load: Component mounts, fetch user from auth context
- Update: No state updates needed for MVP (navigation triggers re-renders)
- Display: Render greeting + quick actions + optional stats

---

### QuickActionCard
**Source**: New component (presentational)  
**Location**: `frontend/src/components/Common/QuickActionCard.tsx` (new)

**Props**:
```typescript
interface QuickActionCardProps {
  icon: React.ReactNode             // Lucide React icon
  title: string                     // Card title: "View Recipes"
  description?: string              // Short description
  actionLabel: string               // Button text: "Explore"
  href: string                      // Navigation target: "/recipes"
  variant?: 'default' | 'secondary' // Visual variant
  badge?: string                    // Optional corner badge
  testId?: string                   // E2E testing identifier
}
```

**Quick Action Definitions** (for Dashboard):
| Title | Icon | Description | Button | Href |
|---|---|---|---|---|
| View Recipes | ChefHat | Browse your recipe library | Explore | /recipes |
| Create Meal Plan | Calendar | Plan your weekly meals | Create | /meal-plans |
| Shopping List | ShoppingCart | Manage ingredients | Review | /shopping-list |
| Your Items | Briefcase | Track your items | Manage | /items |

---

### SidebarState
**Source**: Existing (Radix UI hook)  
**Location**: `frontend/src/components/ui/sidebar.tsx` (Radix provider)

**Properties** (via `useSidebar()` hook):
```typescript
interface SidebarState {
  opened: boolean                   // Sidebar expanded/collapsed
  openMobile: boolean               // Mobile-specific state
  setOpenMobile: (open: boolean) => void
  isMobile: boolean                 // Device detection (<768px)
}
```

**Usage in Feature**:
- Hamburger menu trigger management
- Mobile menu auto-close on navigation
- Responsive sidebar visibility

---

## Component Hierarchy

### Layout Structure

```
<_layout.tsx> (Authenticated Layout Wrapper)
├── <SidebarProvider>
│   ├── <AppSidebar>
│   │   ├── <SidebarHeader> → <Logo>
│   │   ├── <SidebarContent> → <Main items={items}>
│   │   │   └── Navigation links (map over items array)
│   │   └── <SidebarFooter>
│   │       ├── <SidebarAppearance> (theme toggle)
│   │       └── <User> (profile menu + logout)
│   └── <SidebarInset>
│       ├── <header>
│       │   └── <SidebarTrigger> (hamburger icon)
│       ├── <main> → <Outlet> (renders current page)
│       └── <Footer>
│           └── App footer (if any)
```

### Dashboard Component Structure

```
<index.tsx> (Dashboard/Home Page)
├── <WelcomeSection>
│   ├── <h1> "Hi {name} 👋"
│   └── <p> "Welcome message"
├── <QuickActionsGrid>
│   ├── <QuickActionCard> (View Recipes)
│   ├── <QuickActionCard> (Create Meal Plan)
│   ├── <QuickActionCard> (Shopping List)
│   └── <QuickActionCard> (Your Items)
└── [Optional] <StatsSection>
    ├── <StatCard> (Total Recipes)
    ├── <StatCard> (Favorite Items)
    ├── <StatCard> (Active Plans)
    └── <StatCard> (Upcoming Meals)
```

---

## Routes & Navigation Flow

### Route Definitions

```
/_layout/
  └── Authenticated Layout (requires login)
      ├── / (home/dashboard)
      ├── /items
      ├── /recipes (new)
      ├── /meal-plans (new)
      ├── /shopping-list (new)
      ├── /settings
      └── /admin (superuser only)

/login
/signup
/recover-password
/reset-password
```

### Navigation Flow Diagrams

**Desktop (≥768px) - Sidebar always visible**:
```
┌─────────────────────────────────────────┐
│ Logo          | Hamburger trigger       │ ← Header
├──────────────┬────────────────────────────┤
│              │                            │
│ Sidebar      │ Main Content Area          │
│              │ (renders Outlet)           │
│ - Dashboard  │                            │
│ - Items      │ Breadcrumb/Title           │
│ - Recipes    │ Page Content               │
│ - Meal Plans │                            │
│ - Shopping   │                            │
│ - Settings   │                            │
│ - Admin*     │                            │
│              │                            │
│ Theme Toggle │                            │
│ User Menu    │                            │
└──────────────┴────────────────────────────┘
    * Superuser only
```

**Mobile (<768px) - Hamburger menu**:
```
┌────────────────────────────────────┐
│ ☰ Logo          [User Avatar]      │ ← Header
├────────────────────────────────────┤
│                                     │
│ Main Content Area                   │
│ (Sidebar collapsed/off-screen)      │
│                                     │
│                                     │
│                                     │
└────────────────────────────────────┘

When hamburger clicked:
┌────────────────────────────────────┐
│ Logo                               │
├─────────────────────────┐           │
│ Dashboard               │ Content   │
│ Items                   │ Area      │
│ Recipes                 │           │
│ Meal Plans              │           │
│ Shopping List           │           │
│ Settings                │           │
│ Admin*                  │           │
│                         │           │
│ Theme + User Menu       │           │
└─────────────────────────┴───────────┘
    * Superuser only
```

---

## State Management

### Authentication State
**Managed by**: `useAuth()` hook  
**Persistence**: localStorage (Bearer token)  
**Scope**: Global (available in all components)  
**Usage in Feature**:
- Redirect to /login if not authenticated
- Display user info in header and sidebar
- Check is_superuser for conditional admin nav

### Sidebar State
**Managed by**: Radix UI `<SidebarProvider>`  
**Hook**: `useSidebar()`  
**Properties**: `opened`, `openMobile`, `isMobile`  
**Usage in Feature**:
- Auto-detect mobile/desktop
- Control hamburger menu visibility
- Close menu on mobile navigation

### Navigation Active State
**Managed by**: TanStack Router  
**Hook**: `useLocation()`  
**Computed**: Compare current pathname with navigation item paths  
**Usage in Feature**:
- Highlight active navigation item
- Show `aria-current="page"` on active link
- Provide visual feedback to user

---

## Validation & Error Handling

### Navigation Validation
- **Route existence**: TanStack Router handles 404s automatically
- **Permission checking**: Admin route guarded by `is_superuser` check
- **Authentication**: Layout-level guard via `beforeLoad` in `_layout.tsx`

### Dashboard Validation
- **User data**: Always available (authenticated guard ensures it exists)
- **Empty state**: Handle gracefully if stats unavailable or user is new

### User Error Scenarios
| Scenario | Current Handling | Improvement Needed |
|----------|-----------------|-------------------|
| Expired token | Redirects to login | ✅ Existing |
| Invalid route | Shows NotFound component | ✅ Existing |
| Superuser access denied | Not shown in nav | ✅ Existing |
| Mobile nav closes | Sidebar closes automatically | ✅ Existing |
| User loads dashboard | Shows greeting | ✨ Enhance styling |

---

## Accessibility Data Model

### ARIA Labels & Semantic Structure

```html
<nav aria-label="Main navigation">
  <a href="/" aria-current="page" aria-label="Dashboard - Current page">
    Dashboard
  </a>
  <a href="/items" aria-label="Items">Items</a>
  <a href="/recipes" aria-label="Recipes">Recipes</a>
</nav>

<button aria-label="Open navigation menu" aria-expanded="false">
  <span aria-hidden="true">☰</span>
</button>

<main aria-label="Dashboard content">
  <h1 id="page-title">Hi, {name} 👋</h1>
  <section aria-labelledby="quick-actions-title">
    <h2 id="quick-actions-title">Quick Actions</h2>
    <!-- Cards here -->
  </section>
</main>
```

### Keyboard Navigation

- **Tab**: Navigate through all interactive elements (links, buttons, menus)
- **Enter/Space**: Activate buttons, toggle menus
- **Escape**: Close dropdown menus and mobile sidebar
- **Arrow Keys**: Navigate menu items (if implementing advanced patterns)

---

## Dependencies & Integration

### Frontend Dependencies
| Module | Used For | Status |
|--------|----------|--------|
| @tanstack/react-router | File-based routing, navigation detection | ✅ Existing |
| react | UI component framework | ✅ Existing |
| @radix-ui/react-sidebar | Sidebar component + hooks | ✅ Existing |
| lucide-react | Navigation icons | ✅ Existing |
| tailwindcss | Styling and responsive design | ✅ Existing |
| useAuth hook | User authentication & data | ✅ Existing |

### Backend API Dependencies
| Endpoint | Method | Used For | Status |
|----------|--------|----------|--------|
| /api/v1/users/me | GET | Current user data | ✅ Existing |
| (No new endpoints) | - | Feature only uses existing | ✅ Complete |

---

## Scalability & Future Enhancement

### MVP (Current Scope)
- ✅ Navigation with 5+ main items
- ✅ Home page with personalized greeting
- ✅ Quick action cards (4 items)
- ✅ Responsive design
- ✅ Basic accessibility

### Phase 2 (Potential Enhancements)
- 📊 Dashboard statistics section (requires API aggregation)
- 🎨 Customizable dashboard layout (drag/drop widgets)
- 📱 Mobile app version (React Native)
- 🔔 Notification badges on navigation items
- 📈 Analytics dashboard with charts

### Architectural Notes
- **No database changes**: Uses existing User model
- **No backend changes**: Uses existing API endpoints
- **No new dependencies**: All libraries already in stack
- **Incremental adoption**: Can add features without breaking existing functionality

---

**Data Model Status**: ✅ COMPLETE  
**Next Steps**: Create API contracts and quickstart guide
