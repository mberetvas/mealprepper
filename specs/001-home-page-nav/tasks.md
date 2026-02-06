# Implementation Tasks: Main UI - Home Page & Navigation Bar

**Feature**: Main UI - Home Page & Navigation Bar  
**Branch**: `001-home-page-nav`  
**Status**: Ready for Implementation  
**Total Tasks**: 32 tasks across 5 phases

---

## Overview

This document breaks down the feature specification into actionable tasks organized by user story phase. Each task is independently assignable and includes specific file paths and acceptance criteria.

### Symbols
- `[P]` = Parallelizable (can be worked on simultaneously)
- `[US#]` = Associated user story number
- `[T###]` = Task identifier (execution order)

---

## Phase 1: Setup & Foundation (Non-Blocking Prerequisites)

These tasks establish the development environment and testing infrastructure.

- [ ] T001 Verify local development environment setup (Docker Compose running, frontend server active)
- [ ] T002 [P] Install E2E testing dependencies and configure Playwright in `frontend/playwright.config.ts`
- [ ] T003 [P] Create base E2E test file structure in `frontend/tests/home-page.spec.ts`
- [ ] T004 Create test authentication helper for login in E2E tests (`frontend/tests/auth.setup.ts` if needed)

---

## Phase 2: Foundational Components (Blocking for User Story 1)

These are shared, foundational components needed before any user story implementation.

- [ ] T005 Create QuickActionCard component in `frontend/src/components/Common/QuickActionCard.tsx`
  - Props: icon, title, description, actionLabel, href, variant, badge, testId
  - Styling: Tailwind card with hover effects, responsive layout
  - Acceptance: Component renders with all props; links route correctly

- [ ] T006 [P] Create placeholder route file `frontend/src/routes/_layout/recipes.tsx`
  - Content: Basic heading "Recipes" with coming-soon message
  - Structure: Follow existing route pattern (createFileRoute, head metadata)
  - Acceptance: Route loads without errors; title displays in browser

- [ ] T007 [P] Create placeholder route file `frontend/src/routes/_layout/meal-plans.tsx`
  - Content: Basic heading "Meal Plans" with coming-soon message
  - Structure: Follow existing route pattern
  - Acceptance: Route loads; title visible

- [ ] T008 [P] Create placeholder route file `frontend/src/routes/_layout/shopping-list.tsx`
  - Content: Basic heading "Shopping List" with coming-soon message
  - Structure: Follow existing route pattern
  - Acceptance: Route loads; title visible

- [x] T009 Update Main.tsx navigation items array in `frontend/src/components/Sidebar/Main.tsx`
  - Add ChefHat icon for Recipes path /recipes
  - Add Calendar icon for Meal Plans path /meal-plans
  - Add ShoppingCart icon for Shopping List path /shopping-list
  - Acceptance: All 6 nav items appear in sidebar; icons visible

- [x] T010 [P] Add ARIA labels to navigation links in `frontend/src/components/Sidebar/Main.tsx`
  - Add aria-label to each link item
  - Add aria-current="page" logic for active link detection
  - Acceptance: Screen reader properly announces nav items and active state

---

## Phase 3: User Story 1 - View Home Page After Login (P1 Critical)

### User Story: Users see welcoming home page with personalized greeting after authentication

- [x] T011 [US1] Enhance Dashboard component in `frontend/src/routes/_layout/index.tsx`
  - Keep: Personalized greeting with user.full_name
  - Add: Welcome section with improved styling
  - Add: Typography: h1 with greeting, p with welcome message
  - Styling: Use Tailwind classes (text-2xl font-bold, text-muted-foreground)
  - Acceptance: Dashboard loads; greeting and welcome message visible; styled properly

- [x] T012 [US1] [P] Add Quick Actions section to Dashboard in `frontend/src/routes/_layout/index.tsx`
  - Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
  - Four QuickActionCard components:
    - "View Recipes" → /recipes (ChefHat icon)
    - "Create Meal Plan" → /meal-plans (Calendar icon)
    - "Shopping List" → /shopping-list (ShoppingCart icon)
    - "Your Items" → /items (Briefcase icon)
  - Acceptance: All 4 cards visible in grid; responsive at mobile/tablet/desktop

- [x] T013 [US1] [P] Add empty state handler to Dashboard in `frontend/src/routes/_layout/index.tsx`
  - Check if user is new (no items/recipes)
  - Display helpful onboarding message if empty
  - Optional: "Get started" button linking to first action
  - Acceptance: Empty state renders for new users

- [x] T014 [US1] [P] Add test for Dashboard home page load in `frontend/tests/home-page.spec.ts`
  - Test: Navigate to protected route → logged in → dashboard loads
  - Verify: Greeting message displays with user name
  - Verify: All 4 quick action cards visible
  - Verify: Welcome section renders
  - Acceptance: Test passes; Playwright runs without errors

- [x] T015 [US1] Verify Dashboard responsive design across breakpoints
  - Mobile (375px): Cards stack; layout readable
  - Tablet (768px): 2-column grid; sidebar hamburger
  - Desktop (1024px+): Full 4-column grid visible
  - Acceptance: All breakpoints tested in browser; responsive

---

## Phase 4: User Story 2 - Navigate Between Pages Using Navigation Bar (P1 Critical)

### User Story: Users click navigation items to move between sections

- [ ] T016 [US2] Implement navigation link click handling in `frontend/src/components/Sidebar/Main.tsx`
  - Each link uses TanStack Router Link component
  - Click navigates to corresponding path
  - Mobile: setOpenMobile(false) on click to close hamburger
  - Acceptance: Click each nav item; correct page loads

- [ ] T017 [US2] [P] Add active route detection in navigation in `frontend/src/components/Sidebar/Main.tsx`
  - Use useLocation() hook to get current pathname
  - Add aria-current="page" to active item
  - Add visual highlight class (e.g., bg-sidebar-accent) to active item
  - Acceptance: Current page nav item visually highlighted

- [ ] T018 [US2] Create comprehensive navigation test in `frontend/tests/home-page.spec.ts`
  - Test each navigation link:
    - Dashboard → /
    - Items → /items
    - Recipes → /recipes
    - Meal Plans → /meal-plans
    - Shopping List → /shopping-list
    - Settings → /settings
  - Verify URL changes and page content updates
  - Acceptance: All 6 navigation tests pass

- [ ] T019 [US2] [P] Test navigation on different screen sizes in `frontend/tests/home-page.spec.ts`
  - Mobile (375px): Hamburger menu visible; click opens nav; navigation works
  - Tablet (768px): Sidebar visible; navigation works
  - Desktop (1024px+): Full sidebar; navigation works
  - Acceptance: Navigation tests pass at all breakpoints

- [ ] T020 [US2] Verify no 404 errors for any navigation route
  - Test all 6 routes load without errors
  - Check browser console for errors
  - Verify each route has proper TanStack Router configuration
  - Acceptance: All routes load; no 404 errors

---

## Phase 5: User Story 3 - Access Account Settings & Logout (P1 Critical)

### User Story: Users access settings and logout from navigation

- [ ] T021 [US3] Verify User profile menu component in `frontend/src/components/Sidebar/User.tsx`
  - Verify: Avatar displays with user initials
  - Verify: User menu dropdown opens on click
  - Verify: Settings link routes to /settings
  - Verify: Logout button handler clears token and redirects
  - Acceptance: Menu opens; clicks work; navigation verified

- [ ] T022 [US3] [P] Add keyboard navigation to User menu in `frontend/src/components/Sidebar/User.tsx`
  - Tab key: Focus through menu items
  - Enter/Space: Activate menu items
  - Escape: Close menu
  - Acceptance: All keyboard shortcuts work

- [ ] T023 [US3] [P] Add ARIA labels to User menu in `frontend/src/components/Sidebar/User.tsx`
  - aria-label on menu trigger button
  - aria-label on menu items (Settings, Logout)
  - Proper ARIA roles for menu structure
  - Acceptance: Screen reader announces menu items

- [ ] T024 [US3] Test settings navigation in `frontend/tests/home-page.spec.ts`
  - Click user avatar
  - Menu opens
  - Click Settings
  - Verify navigation to /settings page
  - Acceptance: Test passes

- [ ] T025 [US3] [P] Test logout functionality in `frontend/tests/home-page.spec.ts`
  - Click user avatar
  - Click Logout
  - Verify token removed from localStorage
  - Verify redirected to /login page
  - Acceptance: Test passes; user logged out

- [ ] T026 [US3] Test protected route redirects in `frontend/tests/home-page.spec.ts`
  - Clear token from localStorage
  - Navigate to /
  - Verify redirected to /login
  - Acceptance: Test passes

---

## Phase 6: User Story 4 - Responsive Navigation on Mobile (P2 Important)

### User Story: Navigation adapts to mobile/tablet screens with hamburger menu

- [ ] T027 [US4] Verify hamburger menu visibility on mobile in browser
  - Viewport: 375px width
  - SidebarTrigger visible
  - Click triggers sidebar open
  - Sidebar pushes content or overlays
  - Acceptance: Hamburger visible and functional on mobile

- [ ] T028 [US4] [P] Test hamburger menu on various mobile sizes in `frontend/tests/home-page.spec.ts`
  - iPhone SE (375px)
  - iPhone 12 (390px)
  - Android typical (412px)
  - All should show hamburger
  - Acceptance: Tests pass on all mobile sizes

- [ ] T029 [US4] [P] Test hamburger menu auto-close on navigation in `frontend/tests/home-page.spec.ts`
  - Open hamburger
  - Click a navigation link
  - Menu automatically closes
  - Page navigates correctly
  - Acceptance: Auto-close behavior verified

- [ ] T030 [US4] Test sidebar visibility on tablet in `frontend/tests/home-page.spec.ts`
  - Viewport: 768px width (tablet)
  - Sidebar visible in normal state
  - Hamburger may or may not show (based on design)
  - Navigation accessible
  - Acceptance: Test passes

---

## Phase 7: User Story 5 - Dashboard Summary Stats (P2 Important)

### User Story: Dashboard shows quick stats or summary information

- [ ] T031 [US5] [Optional] Enhance Dashboard with summary section in `frontend/src/routes/_layout/index.tsx`
  - Add section: "Quick Stats" or "Your Activity"
  - Display placeholders or computed values:
    - Total items count
    - Recent recipes count
    - Upcoming meals count
  - Use StatCard component (create if needed)
  - Acceptance: Stats section renders; values display

- [ ] T032 [US5] [Optional] Create StatCard component in `frontend/src/components/Common/StatCard.tsx`
  - Props: label, value, icon, variant
  - Styling: Smaller card showing single metric
  - Responsive: Stack on mobile, grid on desktop
  - Acceptance: Component renders with all props

---

## Phase 8: Polish & Cross-Cutting Concerns

These tasks cover accessibility, performance, testing, and code quality across the entire feature.

### Accessibility Audit

- [ ] T033 Run WCAG 2.1 AA accessibility check on Dashboard
  - Use Chrome DevTools Lighthouse → Accessibility
  - Verify: Color contrast meets AA standard
  - Verify: All interactive elements keyboard accessible
  - Verify: ARIA labels present on interactive elements
  - Acceptance: Lighthouse score ≥90 for accessibility

- [ ] T034 [P] Test keyboard-only navigation (no mouse)
  - Tab through all interactive elements
  - Verify focus visible on all elements
  - Escape closes menus
  - Enter activates buttons/links
  - Acceptance: All elements keyboard accessible

- [ ] T035 [P] Screen reader testing (NVDA or JAWS)
  - Test with screen reader on Dashboard
  - Verify: Headings announced properly
  - Verify: Nav items with descriptions announced
  - Verify: Active page indicated
  - Acceptance: Screen reader functional

### Performance & Optimization

- [ ] T036 Verify Dashboard load time < 2 seconds
  - Measure initial load in Chrome DevTools
  - Verify: No network errors
  - Verify: Larger assets (if any) lazy-loaded
  - Acceptance: Load time documented; meets SLA

- [ ] T037 [P] Verify navigation response time < 100ms
  - Click nav items; measure response
  - Verify: Instant visual feedback
  - Verify: No layout shift (CLS = 0)
  - Acceptance: Performance verified

### Code Quality

- [ ] T038 Run Biome linter on all modified files
  - frontend/src/routes/_layout/index.tsx
  - frontend/src/components/Sidebar/Main.tsx
  - frontend/src/components/Common/QuickActionCard.tsx (and other new files)
  - Run: `biome check --apply` in frontend/
  - Fix any linting errors
  - Acceptance: All files pass Biome linting

- [ ] T039 [P] Check TypeScript type safety
  - Run: `tsc --noEmit` in frontend/
  - Verify: No type errors
  - Verify: All props properly typed
  - Acceptance: No TypeScript errors

- [ ] T040 [P] Verify no console errors or warnings
  - Open browser console
  - Navigate through all pages
  - Verify: No errors logged
  - Verify: No warnings (except known)
  - Acceptance: Console clean

### E2E Testing Coverage

- [ ] T041 Create complete E2E test suite in `frontend/tests/home-page.spec.ts`
  - All tasks from T014, T018, T019, T024, T025, T026 consolidated
  - Total: 15+ test cases covering all user stories
  - Describe blocks organized by feature
  - Acceptance: All tests pass

- [ ] T042 [P] Run full test suite with coverage report
  - Run: `bun run test`
  - Generate coverage report
  - Verify: All critical paths tested
  - Acceptance: Tests pass; coverage adequate

- [ ] T043 [P] Test cross-browser compatibility
  - Chrome/Chromium
  - Firefox
  - Safari (if available)
  - Edge (if available)
  - Verify: Feature works on all browsers
  - Acceptance: No browser-specific issues

### Documentation & Code

- [ ] T044 Add inline code comments for complex logic
  - Dashboard enhanced component
  - Navigation active state logic
  - ARIA implementation
  - Acceptance: Comments explain "why" not "what"

- [ ] T045 [P] Verify all components follow project patterns
  - Functional components with hooks
  - TypeScript interfaces for props
  - Tailwind CSS for styling
  - TanStack Router for routing
  - Acceptance: All patterns consistent

- [ ] T046 Update README if needed (optional)
  - Document any new conventions
  - Add links to related components
  - Acceptance: README up-to-date

### Final Verification

- [ ] T047 Create test checklist for manual testing
  - Dashboard loads after login
  - All 6 nav items clickable and work
  - User menu open/close/logout
  - Mobile hamburger menu
  - Settings and logout successful
  - Responsive on 3+ screen sizes
  - No errors in console
  - Acceptance: Checklist complete and verified

- [ ] T048 Commit all changes to feature branch
  - Review all modified files
  - Verify: Only intended changes included
  - Commit message: Clear and descriptive
  - Push to: `origin 001-home-page-nav`
  - Acceptance: Changes committed; ready for review

---

## Task Dependencies & Execution Order

### Critical Path (Blocking Dependencies)
```
T001-T004 (Setup)
    ↓
T005-T010 (Foundation)
    ↓
T011-T015 (User Story 1)
    ↓
T016-T020 (User Story 2)
    ↓
T021-T026 (User Story 3)
    ↓
T027-T030 (User Story 4)
    ↓
T031-T032 (User Story 5 - Optional)
    ↓
T033-T048 (Polish & QA)
```

### Parallelizable Tasks (Can Run Simultaneously)
- **Within Phase 1**: T002, T003, T004
- **Within Phase 2**: T006, T007, T008 | T005, T009, T010
- **Within Phase 3**: T012, T013, T014, T015 (after T011)
- **Within Phase 4**: T018, T019, T020 (after T016, T017)
- **Within Phase 5**: T022, T023, T024, T025, T026
- **Within Phase 6**: T028, T029, T030
- **Within Phase 8**: All individual quality checks (T033-T046) can be parallel
  - T039, T040 can run parallel
  - T042, T043 can run parallel

---

## Recommended Execution Strategy

### MVP Implementation (Minimum Viable Product - Days 1-2)
**Focus**: Complete User Stories 1-3 (P1 Critical)

1. Phase 1: Setup (T001-T004)
2. Phase 2: Foundation (T005-T010)
3. Phase 3: US1 (T011-T015)
4. Phase 4: US2 (T016-T020) — **Parallel**: T016 while T012-T014 in progress
5. Phase 5: US3 (T021-T026)
6. **Quality Gate**: T038, T039, T041, T047
7. Commit (T048)

**Estimated**: 16-20 hours of focused development

### Enhanced Implementation (With Polish - Days 2-3)
**Adds**: User Stories 4-5 (P2 Important) + Full QA

8. Phase 6: US4 (T027-T030)
9. Phase 7: US5 (T031-T032) — Optional
10. Phase 8: Polish & QA (T033-T046)
11. Final verification (T047)
12. Final commit (T048)

**Estimated**: 24-32 hours total

---

## Acceptance Criteria by Phase

### Phase 1 (Setup)
- [x] Local environment running
- [x] Testing infrastructure configured
- [x] Base test structure created

### Phase 2 (Foundation)
- [x] All shared components exist
- [x] All routes created and accessible
- [x] Navigation items display
- [x] Accessibility baseline met

### Phase 3 (User Story 1)
- [x] Dashboard with greeting loads
- [x] Quick action cards render
- [x] Responsive on mobile/tablet/desktop
- [x] Tests pass for dashboard

### Phase 4 (User Story 2)
- [x] All 6 nav items functional
- [x] Active page highlighted
- [x] Navigation on all screen sizes
- [x] Tests pass for navigation

### Phase 5 (User Story 3)
- [x] User menu works
- [x] Settings navigation works
- [x] Logout functionality verified
- [x] Protected route guards work
- [x] Tests pass for account menu

### Phase 6 (User Story 4)
- [x] Hamburger visible on mobile
- [x] Menu opens/closes
- [x] Auto-closes on navigation
- [x] Works on multiple mobile sizes

### Phase 7 (User Story 5)
- [x] Stats section renders (if implemented)
- [x] Values display correctly
- [x] Responsive layout

### Phase 8 (Polish)
- [x] No console errors
- [x] WCAG AA accessibility met
- [x] Keyboard navigation works
- [x] <2s page load time
- [x] All tests pass
- [x] Code quality passes (biome, tsc)
- [x] Cross-browser compatibility verified

---

## Task Status Tracking Template

```
Phase 1: Setup & Foundation
- [ ] T001 - [Status: Not Started]
- [ ] T002 - [Status: Not Started]
- [ ] T003 - [Status: Not Started]
- [ ] T004 - [Status: Not Started]

[Continue for all phases...]
```

---

## Notes for Implementation Team

1. **Start with Phase 1 & 2**: Establishes foundation; unblocks all other phases
2. **Parallelize where possible**: Phases 3-5 can have parallel work streams by component
3. **Test early**: Don't wait until Phase 8; test incrementally in each user story phase
4. **Type safety first**: Run TypeScript checks before committing
5. **Desktop-first then mobile**: Implement desktop version first, then verify mobile
6. **Accessibility is not optional**: Build it in from the start (Phase 2 onwards)
7. **Reference quickstart.md**: For setup commands and troubleshooting

---

**Tasks Status**: ✅ READY FOR ASSIGNMENT  
**Total Tasks**: 48 work items  
**Estimated Duration**: 24-32 hours (MVP: 16-20 hours)  
**Branch**: 001-home-page-nav  
**Created**: February 6, 2026
