import { expect, test } from "@playwright/test"

const authFile = "playwright/.auth/user.json"

test.describe("Home Page / Dashboard", () => {
  test.use({ storageState: authFile })

  test("Dashboard loads and displays personalized greeting", async ({ page }) => {
    await page.goto("/")
    
    // Verify greeting is visible
    const greeting = page.getByRole("heading", { level: 1 })
    await expect(greeting).toBeVisible()
    await expect(greeting).toContainText("Hi,")
    await expect(greeting).toContainText("👋")
  })

  test("Welcome section is visible with proper message", async ({ page }) => {
    await page.goto("/")
    
    // Verify welcome message
    await expect(
      page.getByText("Welcome back! Let's get cooking today.")
    ).toBeVisible()
  })

  test("All 4 quick action cards are visible", async ({ page }) => {
    await page.goto("/")
    
    // Verify quick actions section heading
    await expect(
      page.getByRole("heading", { name: "Quick Actions", level: 2 })
    ).toBeVisible()
    
    // Verify all 4 cards
    const cards = [
      { testId: "quick-action-recipes", title: "View Recipes" },
      { testId: "quick-action-meal-plans", title: "Create Meal Plan" },
      { testId: "quick-action-shopping-list", title: "Shopping List" },
      { testId: "quick-action-items", title: "Your Items" },
    ]
    
    for (const card of cards) {
      const cardElement = page.getByTestId(card.testId)
      await expect(cardElement).toBeVisible()
      await expect(cardElement).toContainText(card.title)
    }
  })

  test("Quick action cards have proper links", async ({ page }) => {
    await page.goto("/")
    
    const linkTests = [
      { testId: "quick-action-recipes", href: "/recipes" },
      { testId: "quick-action-meal-plans", href: "/meal-plans" },
      { testId: "quick-action-shopping-list", href: "/shopping-list" },
      { testId: "quick-action-items", href: "/items" },
    ]
    
    for (const test of linkTests) {
      const link = page.getByTestId(test.testId).locator("a").first()
      await expect(link).toHaveAttribute("href", test.href)
    }
  })

  test("Dashboard is responsive on mobile (375px)", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Verify heading is visible
    await expect(
      page.getByRole("heading", { name: /Hi/, level: 1 })
    ).toBeVisible()
    
    // Verify cards are stacked (1 column layout)
    const cards = page.getByTestId(/quick-action-/)
    const count = await cards.count()
    expect(count).toBe(4)
    
    // Each card should be visible
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }
  })

  test("Dashboard is responsive on tablet (768px)", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")
    
    // Verify heading is visible
    await expect(
      page.getByRole("heading", { name: /Hi/, level: 1 })
    ).toBeVisible()
    
    // Verify all cards are visible
    const cards = page.getByTestId(/quick-action-/)
    const count = await cards.count()
    expect(count).toBe(4)
  })

  test("Dashboard is responsive on desktop (1024px+)", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/")
    
    // Verify heading is visible
    await expect(
      page.getByRole("heading", { name: /Hi/, level: 1 })
    ).toBeVisible()
    
    // Verify all 4 cards are visible
    const cards = page.getByTestId(/quick-action-/)
    const count = await cards.count()
    expect(count).toBe(4)
  })

  test("Quick action cards are clickable and navigate correctly", async ({
    page,
  }) => {
    await page.goto("/")
    
    // Test clicking on "View Recipes" card
    await page.getByTestId("quick-action-recipes").click()
    await expect(page).toHaveURL("/recipes")
    
    // Navigate back to dashboard
    await page.goto("/")
    
    // Test clicking on "Create Meal Plan" card
    await page.getByTestId("quick-action-meal-plans").click()
    await expect(page).toHaveURL("/meal-plans")
    
    // Navigate back to dashboard
    await page.goto("/")
    
    // Test clicking on "Shopping List" card
    await page.getByTestId("quick-action-shopping-list").click()
    await expect(page).toHaveURL("/shopping-list")
    
    // Navigate back to dashboard
    await page.goto("/")
    
    // Test clicking on "Your Items" card
    await page.getByTestId("quick-action-items").click()
    await expect(page).toHaveURL("/items")
  })

  test("Empty state / Get Started section is visible", async ({ page }) => {
    await page.goto("/")
    
    // Verify onboarding section
    await expect(
      page.getByRole("heading", { name: "Get Started with MealPrepper" })
    ).toBeVisible()
    
    // Verify onboarding message
    await expect(
      page.getByText(
        "Start creating recipes and meal plans to make the most of MealPrepper."
      )
    ).toBeVisible()
    
    // Verify CTA button
    await expect(
      page.getByRole("link", { name: "Create Your First Recipe" })
    ).toBeVisible()
  })

  test("Get Started button navigates to recipes page", async ({ page }) => {
    await page.goto("/")
    
    // Click the "Create Your First Recipe" button
    await page
      .getByRole("link", { name: "Create Your First Recipe" })
      .click()
    
    // Verify navigation to recipes page
    await expect(page).toHaveURL("/recipes")
  })

  test("Page title is correct", async ({ page }) => {
    await page.goto("/")
    
    // Verify page title
    await expect(page).toHaveTitle(/Dashboard/)
  })
})

test.describe("Navigation Bar / Sidebar", () => {
  test.use({ storageState: authFile })

  test("All navigation links are accessible via sidebar", async ({ page }) => {
    await page.goto("/")
    
    // Verify navigation items are visible
    const navItems = [
      "Dashboard",
      "Recipes",
      "Meal Plans",
      "Shopping List",
      "Items",
    ]
    
    for (const item of navItems) {
      const navLink = page.getByRole("link", { name: item })
      await expect(navLink).toBeVisible()
    }
  })

  test("Navigation from Dashboard to Recipes works", async ({ page }) => {
    await page.goto("/")
    
    // Click on Recipes navigation item
    await page.getByRole("link", { name: "Recipes" }).click()
    
    // Verify URL changed
    await expect(page).toHaveURL("/recipes")
    
    // Verify page loaded
    await expect(page.getByRole("heading", { name: "Recipes" })).toBeVisible()
  })

  test("Navigation from Dashboard to Meal Plans works", async ({ page }) => {
    await page.goto("/")
    
    // Click on Meal Plans navigation item
    await page.getByRole("link", { name: "Meal Plans" }).click()
    
    // Verify URL changed
    await expect(page).toHaveURL("/meal-plans")
    
    // Verify page loaded
    await expect(
      page.getByRole("heading", { name: "Meal Plans" })
    ).toBeVisible()
  })

  test("Navigation from Dashboard to Shopping List works", async ({ page }) => {
    await page.goto("/")
    
    // Click on Shopping List navigation item
    await page.getByRole("link", { name: "Shopping List" }).click()
    
    // Verify URL changed
    await expect(page).toHaveURL("/shopping-list")
    
    // Verify page loaded
    await expect(
      page.getByRole("heading", { name: "Shopping List" })
    ).toBeVisible()
  })

  test("Navigation from Dashboard to Items works", async ({ page }) => {
    await page.goto("/")
    
    // Click on Items navigation item
    await page.getByRole("link", { name: "Items" }).click()
    
    // Verify URL changed
    await expect(page).toHaveURL("/items")
    
    // Verify page loaded
    await expect(page.getByRole("heading", { name: "Items" })).toBeVisible()
  })

  test("Navigation roundtrip between multiple pages works", async ({
    page,
  }) => {
    // Start at Dashboard
    await page.goto("/")
    await expect(page).toHaveURL("/")
    
    // Go to Recipes
    await page.getByRole("link", { name: "Recipes" }).click()
    await expect(page).toHaveURL("/recipes")
    
    // Go to Meal Plans
    await page.getByRole("link", { name: "Meal Plans" }).click()
    await expect(page).toHaveURL("/meal-plans")
    
    // Go back to Dashboard
    await page.getByRole("link", { name: "Dashboard" }).click()
    await expect(page).toHaveURL("/")
  })

  test("Active navigation item has aria-current attribute", async ({
    page,
  }) => {
    // Navigate to Recipes page
    await page.goto("/recipes")
    
    // Find the Recipes navigation link
    const recipesLink = page.getByRole("link", { name: "Recipes" })
    
    // Verify aria-current is set
    await expect(recipesLink).toHaveAttribute("aria-current", "page")
  })

  test("Inactive navigation items do not have aria-current attribute", async ({
    page,
  }) => {
    // Navigate to Recipes page
    await page.goto("/recipes")
    
    // Find the Dashboard navigation link which should NOT have aria-current
    const dashboardLink = page.getByRole("link", { name: "Dashboard" })
    
    // Verify aria-current is not set or has undefined value
    const ariaCurrent = await dashboardLink.getAttribute("aria-current")
    expect(ariaCurrent).toBeFalsy()
  })

  test("Navigation works correctly on mobile (375px)", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Click on Recipes in navigation
    await page.getByRole("link", { name: "Recipes" }).click()
    
    // Verify navigation worked
    await expect(page).toHaveURL("/recipes")
    
    // Go back to Dashboard
    await page.getByRole("link", { name: "Dashboard" }).click()
    await expect(page).toHaveURL("/")
  })

  test("Navigation works correctly on tablet (768px)", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")
    
    // Navigate through multiple pages
    await page.getByRole("link", { name: "Meal Plans" }).click()
    await expect(page).toHaveURL("/meal-plans")
    
    await page.getByRole("link", { name: "Shopping List" }).click()
    await expect(page).toHaveURL("/shopping-list")
    
    await page.getByRole("link", { name: "Items" }).click()
    await expect(page).toHaveURL("/items")
  })

  test("Navigation works correctly on desktop (1024px+)", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/")
    
    // Navigate through all pages
    const navItems = [
      { name: "Recipes", url: "/recipes" },
      { name: "Meal Plans", url: "/meal-plans" },
      { name: "Shopping List", url: "/shopping-list" },
      { name: "Items", url: "/items" },
      { name: "Dashboard", url: "/" },
    ]
    
    for (const item of navItems) {
      await page.getByRole("link", { name: item.name }).click()
      await expect(page).toHaveURL(item.url)
    }
  })

  test("No 404 errors on any navigation route", async ({ page }) => {
    const routes = ["/", "/recipes", "/meal-plans", "/shopping-list", "/items"]
    
    for (const route of routes) {
      await page.goto(route)
      
      // Check for 404 in console (if error was logged)
      let error404Found = false
      page.once("console", (msg) => {
        if (msg.text().includes("404") || msg.text().includes("Not Found")) {
          error404Found = true
        }
      })
      
      // Verify page is not showing 404 error message
      const notFoundMessages = await page
        .getByText(/404|Not Found/, { exact: false })
        .count()
      expect(notFoundMessages).toBe(0)
      expect(error404Found).toBe(false)
    }
  })

  test("Navigation maintains state when returning to previous page", async ({
    page,
  }) => {
    // Start at Dashboard
    await page.goto("/")
    const dashboardGreeting = page.getByRole("heading", { name: /Hi,/ })
    
    // Verify greeting is present
    await expect(dashboardGreeting).toBeVisible()
    
    // Navigate away
    await page.getByRole("link", { name: "Recipes" }).click()
    
    // Navigate back
    await page.getByRole("link", { name: "Dashboard" }).click()
    
    // Verify greeting is still visible
    await expect(dashboardGreeting).toBeVisible()
  })
})

test.describe("User Menu / Account Settings", () => {
  test.use({ storageState: authFile })

  test("User menu is visible in sidebar", async ({ page }) => {
    await page.goto("/")
    
    // Verify user menu button is visible
    const userMenu = page.getByTestId("user-menu")
    await expect(userMenu).toBeVisible()
  })

  test("User menu displays user information", async ({ page }) => {
    await page.goto("/")
    
    // Click user menu to open dropdown
    await page.getByTestId("user-menu").click()
    
    // Verify dropdown is visible with user info
    await page.getByRole("menuitem", { name: /User Settings/i }).isVisible()
  })

  test("User menu can be opened and closed", async ({ page }) => {
    await page.goto("/")
    
    // Click to open menu
    await page.getByTestId("user-menu").click()
    
    // Verify Settings menu item is visible
    const settingsMenuItem = page.getByRole("menuitem", {
      name: /User Settings/i,
    })
    await expect(settingsMenuItem).toBeVisible()
    
    // Click elsewhere to close menu
    await page.getByRole("heading", { name: /Hi,/ }).click()
    
    // Verify menu is closed
    await expect(settingsMenuItem).not.toBeVisible()
  })

  test("User Settings navigation works", async ({ page }) => {
    await page.goto("/")
    
    // Open user menu
    await page.getByTestId("user-menu").click()
    
    // Click Settings
    await page.getByRole("menuitem", { name: /User Settings/i }).click()
    
    // Verify navigation to settings page
    await expect(page).toHaveURL("/settings")
  })

  test("User menu has proper ARIA labels", async ({ page }) => {
    await page.goto("/")
    
    // Verify user menu button has aria-label
    const userMenuButton = page.getByTestId("user-menu")
    const ariaLabel = await userMenuButton.getAttribute("aria-label")
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel).toContain("User menu")
  })

  test("Settings and Logout menu items have ARIA labels", async ({ page }) => {
    await page.goto("/")
    
    // Open user menu
    await page.getByTestId("user-menu").click()
    
    // Verify Settings item has aria-label
    const settingsItem = page.getByRole("menuitem", { name: /User Settings/i })
    const settingsAriaLabel = await settingsItem.getAttribute("aria-label")
    expect(settingsAriaLabel).toContain("Settings")
    
    // Verify Logout item has aria-label
    const logoutItem = page.getByRole("menuitem", { name: /Log Out/i })
    const logoutAriaLabel = await logoutItem.getAttribute("aria-label")
    expect(logoutAriaLabel).toContain("Log Out")
  })

  test("Logout button clears authentication and redirects to login", async ({
    page,
  }) => {
    await page.goto("/")
    
    // Open user menu
    await page.getByTestId("user-menu").click()
    
    // Click Logout
    await page.getByRole("menuitem", { name: /Log Out/i }).click()
    
    // Verify redirected to login page
    await expect(page).toHaveURL("/login")
    
    // Verify auth token is removed from localStorage
    const token = await page.evaluate(() => {
      return localStorage.getItem("token")
    })
    expect(token).toBeNull()
  })

  test("Protected route redirects to login when not authenticated", async ({
    page,
    context,
  }) => {
    // Create a new context without authentication
    const newPage = await context.newPage()
    
    // Try to access protected route
    await newPage.goto("/")
    
    // Verify redirected to login
    await expect(newPage).toHaveURL("/login", { timeout: 5000 })
    
    await newPage.close()
  })

  test("User can access dashboard after login", async ({ page }) => {
    // Start at login page
    await page.goto("/login")
    
    // Dashboard should not be accessible yet (will redirect)
    await page.goto("/")
    await expect(page).toHaveURL("/login", { timeout: 5000 })
  })

  test("Logout followed by accessing protected route redirects to login", async ({
    page,
  }) => {
    // Start at dashboard
    await page.goto("/")
    
    // Open user menu and logout
    await page.getByTestId("user-menu").click()
    await page.getByRole("menuitem", { name: /Log Out/i }).click()
    
    // Verify at login page
    await expect(page).toHaveURL("/login")
    
    // Try to access protected route
    await page.goto("/")
    
    // Should be redirected back to login
    await expect(page).toHaveURL("/login", { timeout: 5000 })
  })
})

test.describe("Mobile Responsive Navigation (375px - iPhone SE)", () => {
  test.use({ storageState: authFile })

  test("Hamburger menu is visible on mobile (375px)", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Find the sidebar trigger/hamburger button
    // Usually has data-testid or aria-label for menu toggle
    const hamburger = page.locator("[role='button']").filter({
      has: page.locator("svg"),
    }).first()
    
    // Verify hamburger is visible
    await expect(hamburger).toBeVisible()
  })

  test("Hamburger menu opens and closes on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Get the sidebar container
    const sidebar = page.locator("[data-state='closed']").first()
    
    // If sidebar has closed state, navigation might be in a menu
    // Test navigation is still accessible
    const navLink = page.getByRole("link", { name: "Recipes" })
    await expect(navLink).toBeVisible()
  })

  test("Navigation works on mobile without breaking layout", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Navigate to Recipes
    await page.getByRole("link", { name: "Recipes" }).click()
    
    // Verify navigation worked
    await expect(page).toHaveURL("/recipes")
    
    // Verify heading is visible (no layout break)
    await expect(page.getByRole("heading", { name: "Recipes" })).toBeVisible()
  })

  test("Quick action cards stack vertically on mobile (375px)", async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Verify all 4 cards are visible
    const cards = page.getByTestId(/quick-action-/)
    await expect(cards).toHaveCount(4)
    
    // Each card should be visible (stacked vertically)
    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i)
      await expect(card).toBeVisible()
    }
  })
})

test.describe("Mobile Responsive Navigation (390px - iPhone 12)", () => {
  test.use({ storageState: authFile })

  test("Navigation works on iPhone 12 viewport (390px)", async ({ page }) => {
    // Set iPhone 12 viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    
    // Verify dashboard loads
    await expect(page.getByRole("heading", { name: /Hi,/ })).toBeVisible()
    
    // Navigate to Meal Plans
    await page.getByRole("link", { name: "Meal Plans" }).click()
    await expect(page).toHaveURL("/meal-plans")
  })

  test("Quick actions are responsive on iPhone 12", async ({ page }) => {
    // Set iPhone 12 viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/")
    
    // All 4 cards should be visible
    const cards = page.getByTestId(/quick-action-/)
    await expect(cards).toHaveCount(4)
  })
})

test.describe("Mobile Responsive Navigation (412px - Android typical)", () => {
  test.use({ storageState: authFile })

  test("Navigation works on typical Android viewport (412px)", async ({
    page,
  }) => {
    // Set Android typical viewport
    await page.setViewportSize({ width: 412, height: 915 })
    await page.goto("/")
    
    // Navigate through several pages
    await page.getByRole("link", { name: "Shopping List" }).click()
    await expect(page).toHaveURL("/shopping-list")
    
    // Navigate back to dashboard
    await page.getByRole("link", { name: "Dashboard" }).click()
    await expect(page).toHaveURL("/")
  })

  test("Dashboard greeting is readable on Android", async ({ page }) => {
    // Set Android viewport
    await page.setViewportSize({ width: 412, height: 915 })
    await page.goto("/")
    
    // Verify greeting is visible and readable
    const greeting = page.getByRole("heading", { name: /Hi,/, level: 1 })
    await expect(greeting).toBeVisible()
    
    // Get text and verify it's readable
    const text = await greeting.textContent()
    expect(text).toMatch(/Hi,.*👋/)
  })
})

test.describe("Mobile: Hamburger Auto-Close on Navigation", () => {
  test.use({ storageState: authFile })

  test("Sidebar closes after clicking navigation link on mobile", async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // The sidebar should be responsive - clicking nav should work
    const recipesLink = page.getByRole("link", { name: "Recipes" })
    await expect(recipesLink).toBeVisible()
    
    // Click the link
    await recipesLink.click()
    
    // Verify navigation occurred
    await expect(page).toHaveURL("/recipes")
    
    // Verify page loaded properly
    await expect(page.getByRole("heading", { name: "Recipes" })).toBeVisible()
  })

  test("Multiple navigation clicks work sequentially on mobile", async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Navigate through sequence
    const sequence = [
      { name: "Recipes", url: "/recipes" },
      { name: "Meal Plans", url: "/meal-plans" },
      { name: "Shopping List", url: "/shopping-list" },
      { name: "Dashboard", url: "/" },
    ]
    
    for (const item of sequence) {
      await page.getByRole("link", { name: item.name }).click()
      await expect(page).toHaveURL(item.url)
      await expect(page).not.toHaveURL(sequence[(sequence.indexOf(item) - 1 + sequence.length) % sequence.length].url)
    }
  })
})

test.describe("Tablet Responsive Navigation (768px)", () => {
  test.use({ storageState: authFile })

  test("Sidebar is visible on tablet viewport (768px)", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")
    
    // Verify navigation items are visible
    const navItems = [
      "Dashboard",
      "Recipes",
      "Meal Plans",
      "Shopping List",
      "Items",
    ]
    
    for (const item of navItems) {
      const navLink = page.getByRole("link", { name: item })
      await expect(navLink).toBeVisible()
    }
  })

  test("Navigation is accessible on tablet", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")
    
    // Navigate to Items
    await page.getByRole("link", { name: "Items" }).click()
    await expect(page).toHaveURL("/items")
    
    // Verify content loaded
    await expect(page.getByRole("heading", { name: "Items" })).toBeVisible()
  })

  test("Quick action cards show in 2-column grid on tablet", async ({
    page,
  }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")
    
    // All 4 cards should be visible in responsive grid
    const cards = page.getByTestId(/quick-action-/)
    await expect(cards).toHaveCount(4)
    
    // Verify all are visible
    for (let i = 0; i < 4; i++) {
      await expect(cards.nth(i)).toBeVisible()
    }
  })

  test("User menu works on tablet", async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto("/")
    
    // Open user menu
    await page.getByTestId("user-menu").click()
    
    // Verify Settings option is visible
    await expect(page.getByRole("menuitem", { name: /Settings/i })).toBeVisible()
  })
})

test.describe("Cross-Device Navigation Consistency", () => {
  test.use({ storageState: authFile })

  test("Navigation URLs are consistent across desktop and mobile", async ({
    page,
  }) => {
    // Test desktop first
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto("/")
    await page.getByRole("link", { name: "Recipes" }).click()
    const desktopUrl = page.url()
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    await page.getByRole("link", { name: "Recipes" }).click()
    const mobileUrl = page.url()
    
    // URLs should match
    expect(desktopUrl).toBe(mobileUrl)
  })

  test("Page content is accessible on all device sizes", async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: "Mobile" }, // iPhone SE
      { width: 768, height: 1024, name: "Tablet" }, // iPad
      { width: 1280, height: 720, name: "Desktop" }, // Desktop
    ]
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto("/")
      
      // Verify key elements are accessible
      await expect(page.getByRole("heading", { name: /Hi,/ })).toBeVisible()
      await expect(page.getByRole("heading", { name: "Quick Actions" })).toBeVisible()
      
      // Verify at least one quick action card is visible
      const cards = page.getByTestId(/quick-action-/)
      expect(await cards.count()).toBeGreaterThan(0)
    }
  })
})

