import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/recipes")({
  component: Recipes,
  head: () => ({
    meta: [
      {
        title: "Recipes - MealPrepper",
      },
    ],
  }),
})

function Recipes() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Recipes</h1>
      <p className="text-muted-foreground">
        Manage and explore your recipe library. This page is coming soon!
      </p>
    </div>
  )
}
