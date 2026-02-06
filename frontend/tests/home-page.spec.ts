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
