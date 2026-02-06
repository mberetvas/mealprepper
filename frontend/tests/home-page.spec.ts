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
