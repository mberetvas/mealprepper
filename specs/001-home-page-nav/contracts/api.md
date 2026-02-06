# API Contracts: Main UI - Home Page & Navigation Bar

**Phase**: Phase 1 - Design & Contracts  
**Created**: February 6, 2026  
**Feature**: Main UI - Home Page & Navigation Bar  
**Branch**: `001-home-page-nav`

---

## API Contract Summary

**No new backend API endpoints are required for this feature.**

The home page and navigation UI use only existing, already-implemented API endpoints from the authentication and user management systems.

---

## Existing API Endpoints (Used by Feature)

### 1. Get Current User

**Endpoint**: `GET /api/v1/users/me`

**Purpose**: Retrieve current authenticated user information (used in Layout, Dashboard, and User menu)

**Request**:
```
GET /api/v1/users/me HTTP/1.1
Host: localhost:8000
Authorization: Bearer {token}
```

**Success Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "detail": "Invalid authentication credentials"
}
```

**Usage in Feature**:
| Component | Purpose | Field Used |
|-----------|---------|-----------|
| Dashboard (index.tsx) | Personalized greeting | full_name, email |
| User (sidebar) | Profile display | full_name, email |
| AppSidebar | Conditional admin nav | is_superuser |
| Layout guard | Redirect if not authenticated | (presence of token) |

**Contract Notes**:
- ✅ Already implemented in authentication system
- ✅ Used in `useAuth()` hook
- ✅ No changes needed for this feature
- ✅ Token automatically included in Axios instance (frontend)

---

### 2. Logout (Implicit - Client-side)

**Endpoint**: `(No HTTP call - client-side token deletion)`

**Purpose**: Remove authentication token from local storage and redirect to login

**Implementation**:
```typescript
// In useAuth() hook or logout handler:
localStorage.removeItem('token')
router.navigate({ to: '/login' })
```

**Usage in Feature**:
| Component | Purpose |
|-----------|---------|
| User dropdown | Logout button handler |
| Layout guard | Redirect if token missing |

**Contract Notes**:
- ✅ Existing implementation in `useAuth()` hook
- ✅ User component already has logout button
- ✅ No new functionality needed

---

## API Contract Patterns (Used Throughout Feature)

### Authentication Header Pattern
```
Authorization: Bearer {access_token}
```

**Implementation**: Axios interceptor automatically adds this header  
**Location**: Frontend OpenAPI client configuration (`frontend/src/main.tsx`)

### Error Handling Pattern
```json
{
  "detail": "Error message"
}
```

**Patterns Used**:
- 401: Invalid/expired credentials → Redirect to login
- 403: Insufficient permissions → Show error page
- 404: Resource not found → Show 404 page
- 500: Server error → Show error component

---

## Frontend API Client Contract

**Generated Client**: `frontend/src/client/` (auto-generated from backend OpenAPI schema)

**Types Used**:
```typescript
import { UserPublic } from '@/client'

interface UserPublic {
  id: UUID
  email: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
}
```

**Endpoints Consumed**:
```typescript
import { useQuery } from '@tanstack/react-query'

// Example usage (already in useAuth hook):
const { data: user } = useQuery({
  queryKey: ['user', 'me'],
  queryFn: () => apiClient.users.getUsersMe()
})
```

---

## Response Data Contracts by Component

### Dashboard Component Contract

**Input Data** (dependencies):
```typescript
// From authentication context
user: {
  id: UUID
  email: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
}
```

**Output Data** (displayed to user):
```html
<h1>Hi, {user.full_name} 👋</h1>
<p>Welcome back, nice to see you again</p>

<!-- Quick action cards -->
- View Recipes (link to /recipes)
- Create Meal Plan (link to /meal-plans)
- Shopping List (link to /shopping-list)
- Your Items (link to /items)
```

**Contract Validation**:
- ✅ user object always present (auth guard ensures it)
- ✅ full_name always populated (API contract)
- ✅ All links route to valid, existing paths

---

### Sidebar/Navigation Contract

**Input Data**:
```typescript
user: { is_superuser: boolean }
```

**Output Data**:
```typescript
items: NavigationItem[] = [
  { icon: Home, title: "Dashboard", path: "/" },
  { icon: Briefcase, title: "Items", path: "/items" },
  { icon: ChefHat, title: "Recipes", path: "/recipes" },
  { icon: Calendar, title: "Meal Plans", path: "/meal-plans" },
  { icon: ShoppingCart, title: "Shopping List", path: "/shopping-list" },
  { icon: Settings, title: "Settings", path: "/settings" },
  ...(user?.is_superuser ? [{ icon: Users, title: "Admin", path: "/admin" }] : [])
]
```

**Contract Validation**:
- ✅ 5 main items always present
- ✅ Admin item only present if is_superuser = true
- ✅ All paths exist and are routable

---

### User Profile Menu Contract

**Input Data**:
```typescript
user: {
  full_name: string
  email: string
}
```

**Output UI**:
- User initials avatar (computed from full_name)
- Full name display
- Email display
- Settings link (routes to /settings)
- Logout button (clears token, redirects to /login)

**Contract Validation**:
- ✅ User always authenticated (layout guard ensures it)
- ✅ Settings route exists
- ✅ Logout handler implemented

---

## No Breaking Changes
| Aspect | Impact | Status |
|--------|--------|--------|
| User API | Feature only reads; no writes | ✅ Safe |
| Authentication | No changes to flow | ✅ Safe |
| Existing routes | No modifications to existing functionality | ✅ Safe |
| Database | No schema changes needed | ✅ Safe |
| Dependencies | No new dependencies required | ✅ Safe |

---

## Frontend-only Contract Definitions

### TanStack Router Contract
**Pattern Used**: File-based routing  
**Contract**: Route paths match exactly with navigation item paths

```typescript
// Navigation item
{ path: "/recipes" }

// Corresponding route file
frontend/src/routes/_layout/recipes.tsx
```

**Validation**: All 5 navigation items must have corresponding route files

---

### Component Prop Contracts

#### QuickActionCard Component (New Component)
```typescript
interface QuickActionCardProps {
  icon: React.ReactNode      // Required: Lucide React icon
  title: string              // Required: Card title
  description?: string       // Optional: Subtitle/description
  actionLabel: string        // Required: Button text
  href: string               // Required: Navigation target
  variant?: 'default' | 'secondary'  // Optional: Visual variant
  badge?: string             // Optional: Badge text
  testId?: string            // Optional: For E2E testing
}
```

**Usage Example**:
```tsx
<QuickActionCard
  icon={<ChefHat size={24} />}
  title="View Recipes"
  description="Browse your recipe library"
  actionLabel="Explore"
  href="/recipes"
  testId="quick-action-recipes"
/>
```

---

### Hook Contracts

#### useAuth Hook (Existing)
```typescript
interface UseAuthReturn {
  user: UserPublic | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoggedIn: () => boolean
}
```

#### useSidebar Hook (Radix UI - Existing)
```typescript
interface UseSidebarReturn {
  opened: boolean
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
}
```

---

## Environment Variables (No Changes)

The feature uses existing environment configuration:

```
VITE_API_URL=http://localhost:8000   # Backend API base URL
NODE_ENV=development|production       # Runtime environment
```

No new environment variables required.

---

## Contract Compliance Checklist

- [x] All data contracts mapped to existing API endpoints
- [x] No new API endpoints required
- [x] No database schema changes needed
- [x] All component prop interfaces documented
- [x] All hook contracts defined
- [x] Error handling patterns identified
- [x] Response types match generated client types
- [x] No breaking changes to existing contracts

---

## Summary

This feature **operates entirely within existing API contracts**. The navigation and home page are pure UI enhancements that:

1. **Read** from existing `/api/v1/users/me` endpoint
2. **Consume** existing authentication context
3. **Navigate** between frontend routes (no HTTP calls)
4. **Display** user data via existing components and patterns

**Zero new API contracts needed.**

---

**Contract Status**: ✅ VERIFIED - All requirements can be met with existing APIs  
**Next Steps**: Create quickstart guide for development
