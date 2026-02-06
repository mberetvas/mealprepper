import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/meal-plans")({
  component: MealPlans,
  head: () => ({
    meta: [
      {
        title: "Meal Plans - MealPrepper",
      },
    ],
  }),
})

function MealPlans() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Meal Plans</h1>
      <p className="text-muted-foreground">
        Create and manage your weekly meal plans. This page is coming soon!
      </p>
    </div>
  )
}
