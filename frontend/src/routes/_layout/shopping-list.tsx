import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/shopping-list")({
  component: ShoppingList,
  head: () => ({
    meta: [
      {
        title: "Shopping List - MealPrepper",
      },
    ],
  }),
})

function ShoppingList() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Shopping List</h1>
      <p className="text-muted-foreground">
        Manage your shopping list based on your meal plans. This page is coming soon!
      </p>
    </div>
  )
}
