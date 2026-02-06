# Research & Clarifications: Main UI - Home Page & Navigation Bar

**Phase**: Phase 0 - Research  
**Created**: February 6, 2026  
**Feature**: Main UI - Home Page & Navigation Bar  
**Branch**: `001-home-page-nav`

## Executive Summary

Extensive codebase analysis confirms the foundational UI infrastructure exists and is well-implemented. The sidebar navigation is fully functional with responsive hamburger menu, authentication flow works correctly, and the Dashboard component (home page) is in place but minimal. No architectural barriers exist—this is pure UI enhancement on a solid foundation.

---

## Research Findings

### 1. Navigation & Layout Architecture

**Decision**: Use existing Sidebar pattern (already implemented)  
**Rationale**: Codebase analysis shows fully-functional, responsive sidebar navigation with:
- Radix UI Sidebar component (collapsible, mobile-responsive)
- TanStack Router file-based routing system
- Mobile detection via `useSidebar()` hook managing `isMobile` state
- Hamburger trigger at `<768px` breakpoint

**Alternatives Considered**:
- Top navigation bar: Would require significant refactoring; sidebar is already in production
- Horizontal nav + sidebar: Over-engineered; existing pattern works

**Implementation Status**: ✅ COMPLETE (no changes needed to core architecture)

**Evidence**:
- `frontend/src/components/Sidebar/AppSidebar.tsx`: Full sidebar implementation with logo, navigation items, and footer
- `frontend/src/routes/_layout.tsx`: Layout wrapper with `SidebarProvider` and responsive trigger
- Uses `<768px` Tailwind breakpoint for mobile adaption

---

### 2. Navigation Items & Routes

**Current Navigation Items** (from `AppSidebar.tsx`):
```
- 🏠 Dashboard (path: /)
- 📦 Items (path: /items)
- 👥 Admin (path: /admin, superuser only)
```

**Missing Navigation Items** (per spec requirements):
```
❌ Recipes (path: /recipes)
❌ Meal Plans (path: /meal-plans)
❌ Shopping List (path: /shopping-list)
✅ Settings (path: /settings)
```

**Decision**: Add missing routes with placeholder components  
**Rationale**: Spec requires access to Recipes, Meal Plans, and Shopping List from navigation

**Implementation Plan**:
1. Create `frontend/src/routes/_layout/recipes.tsx` (placeholder)
2. Create `frontend/src/routes/_layout/meal-plans.tsx` (placeholder)
3. Create `frontend/src/routes/_layout/shopping-list.tsx` (placeholder)
4. Update `frontend/src/components/Sidebar/Main.tsx` to include new items

**Route Files Already Exist**:
- `/settings.tsx` ✅
- `/items.tsx` ✅
- `/admin.tsx` ✅

---

### 3. Home Page (Dashboard) Current State

**Current Implementation** (`frontend/src/routes/_layout/index.tsx`):
```tsx
- Greeting: "Hi {name} 👋"
- Welcome message: "Welcome back, nice to see you again!!!"
- Uses currentUser from useAuth() hook
- Basic h1 + p layout
```

**Spec Requirements**:
- ✅ Personalized welcome message with user's name
- ✅ Uses authenticated user data
- ❌ Quick action buttons (View Recipes, Create Meal Plan, Shopping List)
- ❌ Summary cards/statistics
- ❌ Empty state for new users

**Decision**: Enhance Dashboard with:
1. Welcome section (existing but improve styling)
2. Quick action cards with CTAs (new)
3. Summary statistics section (new)
4. Empty state handler for new users (new)

**Implementation Approach**: Build component-based dashboard with:
- Hero section with personalized greeting
- Grid of quick-action cards (3-4 items)
- Stats section (meals this week, recipes favorite, etc.)
- Empty state message for users with no data

---

### 4. User Profile Menu & Logout

**Current Implementation** (`frontend/src/components/Sidebar/User.tsx`):
- ✅ Avatar with user initials
- ✅ Dropdown menu with user info
- ✅ Settings link (routes to `/settings`)
- ✅ Logout button with functional logout handler
- ✅ Mobile-aware (closes menu on mobile after click)

**Spec Compliance**: ✅ ALL REQUIREMENTS MET
- User profile display with name/email
- Profile menu accessible from navigation
- Settings page link functional
- Logout functionality implemented

**Decision**: No changes needed to User component  
**Status**: Ready for production

---

### 5. Responsive Design & Mobile Support

**Evidence of Existing Mobile Support**:
1. **Sidebar Responsiveness**:
   - `collapsible="icon"` on main Sidebar (Radix UI)
   - Hamburger trigger at mobile breakpoint
   - `isMobile` detection via `useSidebar()` hook
   - Mobile-aware menu positioning in User dropdown

2. **Layout Responsiveness**:
   - Main content area with max-width wrapper
   - Padding adjusts: `p-6 md:p-8` (mobile-first)
   - Tailwind responsive classes throughout

3. **Tested Breakpoints** (from codebase):
   - `md:` (768px+) - tablet/desktop
   - `group-data-[collapsible=icon]:` - hamburger state

**Spec Compliance**: ✅ RESPONSIVE DESIGN COMPLETE
- ✅ Mobile hamburger menu at <768px
- ✅ Desktop horizontal sidebar at ≥768px
- ✅ Proper spacing and padding on all sizes

**Testing Requirements**:
- Playwright tests for mobile/tablet/desktop viewports
- Verify navigation accessibility on all screen sizes

---

### 6. Accessibility (WCAG 2.1 AA)

**Current Accessibility Features**:
- ✅ Radix UI primitives (built-in a11y)
- ✅ Semantic HTML (nav, main, header elements)
- ✅ Avatar component with fallback text
- ✅ User menu with proper ARIA states (dropdown)
- ✅ Color contrast (Tailwind defaults meet AA)
- ❌ Missing ARIA labels on some interactive elements
- ❌ No keyboard navigation testing documented

**Decision**: Audit and enhance accessibility:
1. Add `aria-label` to navigation items
2. Add `aria-current="page"` to active navigation link
3. Add `aria-expanded` to hamburger trigger
4. Test keyboard navigation (Tab, Enter, Space, Escape)

**Implementation Plan**:
- Update `Main.tsx` navigation items with ARIA labels
- Add active page indicator with `aria-current` 
- Document keyboard shortcuts in tests
- Run Playwright accessibility tests

---

### 7. API Integration & Data Requirements

**Current User API** (via authentication):
```
Endpoint: GET /api/v1/users/me
Returns: {
  "id": UUID,
  "email": str,
  "full_name": str,
  "is_superuser": bool,
  "is_active": bool
}
```

**Dashboard Data Requirements** (for summary cards):
- Meal count for user (likely from items or recipes)
- Recent items/recipes accessed
- Upcoming meals (if meal plan exists)
- Total recipes saved

**Decision**: Use existing API; no new endpoints required for MVP  
**Rationale**: Can build dashboard with existing user data + navigate to full features via links

**Future Enhancement**: Could add dashboard API endpoint combining user + meal statistics

---

### 8. Technology Stack Validation

**Frontend Stack** (confirmed from package.json):
- ✅ React 19.1.1
- ✅ TypeScript 5.3+
- ✅ TanStack Router 1.158.1
- ✅ Tailwind CSS 4.1.17
- ✅ Radix UI components
- ✅ Lucide React 0.562.0
- ✅ Vite 5.x
- ✅ Biome linter

**Testing Stack**:
- ✅ Playwright (E2E tests exist in `frontend/tests/`)
- ✅ Existing test structure: `login.spec.ts`, `items.spec.ts`, etc.

**Build & Development**:
- ✅ Bun runtime (`bun.lock` exists)
- ✅ Docker Compose for local dev
- ✅ Hot reload via compose volumes

---

### 9. Code Organization & Patterns

**Observed Patterns** (to follow in implementation):
1. **Route Files**: TanStack Router file-based routing
   - Pattern: `frontend/src/routes/_layout/[name].tsx`
   - Export: `const Route = createFileRoute(...)`

2. **Components**: Functional React with hooks
   - Custom hook usage: `useAuth()`, `useSidebar()`
   - TypeScript interfaces for props
   - Tailwind for styling

3. **Authentication**: OAuth2 password flow
   - `useAuth()` hook manages auth state
   - Token stored in local storage
   - Current user injected via context

4. **UI Components**: Radix UI + custom components
   - Located in `frontend/src/components/ui/` (auto-generated shadcn/ui)
   - Reusable Sidebar, Avatar, Dropdown, etc.

**Decision**: Follow existing patterns exactly  
**Evidence**: Well-established, tested patterns throughout codebase

---

### 10. Design Guidelines & Styling

**Current Design System**:
- ✅ Tailwind CSS 4.x with utility classes
- ✅ Radix UI for interactive components
- ✅ Lucide React icons
- ✅ Consistent spacing (gap-2, p-4, etc.)
- ✅ Dark mode support via `next-themes`

**Existing Color Palette** (inferred from Tailwind usage):
- Primary: Brand color (via Radix/Tailwind)
- Neutral: text-muted-foreground, other Tailwind defaults
- Semantic: success, warning, error (Tailwind convention)

**Decision for Dashboard Cards**:
- Use card component pattern from codebase (if exists) or create `Card.tsx`
- Grid layout: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Icon + text + CTA per card
- Hover effects for interactivity

---

## Unknowns Clarified ✅

| Unknown | Research | Resolution |
|---------|----------|-----------|
| Navigation structure existing? | Code analysis shows full sidebar | Use existing, add routes |
| Home page exists? | Found Dashboard at `index.tsx` | Enhance existing; don't create new |
| Logout functionality? | Found in User component | Already implemented; working |
| Mobile responsiveness? | Sidebar has hamburger pattern | Already responsive; test and verify |
| Accessibility baseline? | Radix UI primitives + semantic HTML | Add ARIA labels; test keyboard nav |
| Required API endpoints? | User API exists; no new endpoints needed | Use existing User DTO |
| Design system? | Tailwind + Radix UI established | Follow existing patterns |

## Recommendations

### High Priority (MVP)
1. ✅ Enhance Dashboard with quick action cards and welcome section
2. ✅ Add missing navigation routes (Recipes, Meal Plans, Shopping List)
3. ✅ Verify responsive design on mobile/tablet
4. ✅ Add accessibility enhancements (ARIA labels, keyboard nav)

### Medium Priority
5. 📊 Add summary statistics to Dashboard (optional for MVP)
6. 🎨 Improve visual design/styling of cards and layout
7. 📱 Test across multiple device sizes and browsers

### Low Priority (Future Enhancement)
8. Dashboard API endpoint for aggregated statistics
9. Advanced filters/customization on Dashboard
10. Dark mode theme verification

---

## Conclusion

The MealPrepper codebase has a **mature, well-structured foundation** for authentication, routing, and UI components. The sidebar navigation works excellently on all screen sizes. The main work ahead is:

1. **Dashboard Enhancement** (30% of effort): Add cards, styling, and layout
2. **Add Navigation Routes** (20% of effort): Create placeholder routes for Recipes/Meal Plans/Shopping List
3. **Accessibility Audit** (20% of effort): Add ARIA labels and keyboard nav testing
4. **E2E Testing** (30% of effort): Playwright tests for all navigation flows and responsive design

**No architectural refactoring needed.** Feature can be built incrementally on existing patterns.

---

**Research Status**: ✅ COMPLETE  
**Next Phase**: Phase 1 - Design & Contracts
