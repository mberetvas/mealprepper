# Manual Testing Checklist - Home Page & Navigation Feature

**Date**: February 6, 2026  
**Feature**: 001-home-page-nav  
**Tester**: [Your Name]  
**Browser**: [Chrome/Firefox/Safari/Edge]  
**Device**: [Desktop/Mobile/Tablet]

---

## Authentication & Home Page

- [ ] **Login and Redirect**: User logs in and is redirected to dashboard (`/`)
- [ ] **Greeting Displayed**: "Hi, [User Name] 👋" greeting is visible
- [ ] **Welcome Message**: "Welcome back! Let's get cooking today." appears
- [ ] **Page Title**: Browser tab title shows "Dashboard"

---

## Quick Actions Section

- [ ] **Section Heading**: "Quick Actions" heading is visible
- [ ] **All 4 Cards Visible**: View Recipes, Create Meal Plan, Shopping List, Your Items
- [ ] **Card Icons**: Each card shows the correct icon
- [ ] **Card Descriptions**: Each card displays descriptive text
- [ ] **Action Labels**: Call-to-action buttons visible on each card

---

## Dashboard Stats Section

- [ ] **Stats Heading**: "Your Activity" section heading visible
- [ ] **All 3 Stats**: Items count, Recipes count, Meal Plans count displayed
- [ ] **Stat Values**: All show "0" (for new user)
- [ ] **Stat Icons**: Briefcase, Chef hat, Calendar icons visible
- [ ] **Color Variants**: Stats have different color backgrounds (blue, green, yellow)

---

## Navigation Functionality

### Desktop (1280px+)

- [ ] **Sidebar Visible**: Left sidebar with all nav items visible
- [ ] **Dashboard Link**: Clickable, navigates to `/`
- [ ] **Recipes Link**: Clickable, navigates to `/recipes`
- [ ] **Meal Plans Link**: Clickable, navigates to `/meal-plans`
- [ ] **Shopping List Link**: Clickable, navigates to `/shopping-list`
- [ ] **Items Link**: Clickable, navigates to `/items`
- [ ] **Active State**: Current page nav item is highlighted
- [ ] **Navigation Speed**: Links respond instantly (< 100ms)

### Tablet (768px)

- [ ] **Sidebar Visible**: Sidebar visible on tablet
- [ ] **Navigation Works**: All nav items clickable
- [ ] **Responsive Layout**: Content doesn't overflow
- [ ] **Quick Actions Grid**: Shows in 2-column layout
- [ ] **Stats Layout**: All 3 stats visible in row or 2-column grid

### Mobile (375px)

- [ ] **Full Screen**: Layout fills screen width
- [ ] **Navigation Accessible**: All nav items accessible
- [ ] **Cards Stack**: Quick action cards stack vertically (1 column)
- [ ] **Text Readable**: All text readable without zooming
- [ ] **Stats Stacked**: Stats cards stack vertically
- [ ] **Spacing**: No content cut off or overlapping

---

## User Menu (Account)

- [ ] **User Menu Button**: Avatar with initials visible in sidebar footer
- [ ] **Menu Opens**: Clicking avatar opens dropdown menu
- [ ] **User Info**: Full name and email displayed in menu
- [ ] **Settings Option**: "User Settings" menu item visible
- [ ] **Logout Option**: "Log Out" menu item visible
- [ ] **Settings Navigation**: Click "Settings" → navigates to `/settings`
- [ ] **Menu Closes**: Menu closes after selecting option or clicking elsewhere

---

## Logout Functionality

- [ ] **Initiate Logout**: Click avatar → "Log Out"
- [ ] **Redirected**: Redirected to `/login` page
- [ ] **Token Cleared**: Local storage no longer contains token
- [ ] **Protected Routes**: Accessing `/` redirects to `/login`
- [ ] **Re-login**: Can log in again successfully
- [ ] **Dashboard Access**: After re-login, dashboard loads

---

## Protected Routes

- [ ] **Dashboard Protected**: Clear session → navigate to `/` → redirects to `/login`
- [ ] **Recipes Protected**: Logged out user cannot access `/recipes`
- [ ] **Meal Plans Protected**: Logged out user cannot access `/meal-plans`
- [ ] **Shopping List Protected**: Logged out user cannot access `/shopping-list`
- [ ] **Items Protected**: Logged out user cannot access `/items`

---

## Accessibility & Keyboard Navigation

- [ ] **Tab Navigation**: Can tab through all navigation items
- [ ] **Focus Visible**: Focus ring visible on focused elements
- [ ] **Enter Key**: Pressing Enter activates links/buttons
- [ ] **Escape Key**: Pressing Escape closes dropdown menus
- [ ] **Headings Semantic**: PageTitle (h1), Section headings (h2) proper structure
- [ ] **ARIA Labels**: Screen reader announces navigation items
- [ ] **Aria-Current**: Active nav item has `aria-current="page"` attribute

---

## Browser Console & Errors

- [ ] **No Errors**: Console shows no red error messages
- [ ] **No Warnings**: No JavaScript warnings logged
- [ ] **No 404s**: All pages load without 404 errors
- [ ] **Network Tab**: All API calls successful (200 OK)
- [ ] **Performance**: Initial load < 2 seconds

---

## Responsive & Cross-Device Testing

### Device Tests
- [ ] **Desktop (1280x720)**: Desktop experience working
- [ ] **iPad (768x1024)**: Tablet experience working
- [ ] **iPhone SE (375x667)**: Mobile experience working
- [ ] **iPhone 12 (390x844)**: Mobile experience working
- [ ] **Android (412x915)**: Mobile experience working

### Feature Consistency Across Devices
- [ ] **Same Nav Items**: All devices show same 5 nav items
- [ ] **Same Functionality**: All links work on all devices
- [ ] **Same Stats**: Stats display on all breakpoints
- [ ] **Same User Menu**: Account menu accessible on all devices

---

## Quick Actions Click Testing

- [ ] **View Recipes**: Click card → navigate to `/recipes` → "Recipes" page loads
- [ ] **Create Meal Plan**: Click card → navigate to `/meal-plans` → "Meal Plans" page loads
- [ ] **Shopping List**: Click card → navigate to `/shopping-list` → "Shopping List" page loads
- [ ] **Your Items**: Click card → navigate to `/items` → "Items" page loads
- [ ] **Get Started Button**: Click "Create Your First Recipe" → navigate to `/recipes`

---

## Performance Checklist

- [ ] **Page Load Time**: Dashboard loads in < 2 seconds
- [ ] **Navigation Speed**: Clicking nav items shows instant visual feedback
- [ ] **CLS Score**: No layout shift when navigating
- [ ] **Interactive**: Page is interactive within < 5 seconds
- [ ] **No Jank**: Scrolling and animations smooth

---

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| Authentication | ✓/✗ | - |
| Home Page | ✓/✗ | - |
| Stats Section | ✓/✗ | - |
| Navigation | ✓/✗ | - |
| User Menu | ✓/✗ | - |
| Logout | ✓/✗ | - |
| Protected Routes | ✓/✗ | - |
| Accessibility | ✓/✗ | - |
| Mobile Responsive | ✓/✗ | - |
| Browser Console | ✓/✗ | - |
| Performance | ✓/✗ | - |

**Overall Status**: ✓ Pass / ✗ Fail  
**Issues Found**: [List any issues]  
**Blockers**: [List any blockers]  
**Comments**: [Any additional notes]

---

**Tester Signature**: _________________ **Date**: _________

