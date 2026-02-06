import { createFileRoute, Link as RouterLink } from "@tanstack/react-router"
import {
  Briefcase,
  Calendar,
  ChefHat,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react"

import QuickActionCard from "@/components/Common/QuickActionCard"
import StatCard from "@/components/Common/StatCard"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Dashboard - FastAPI Cloud",
      },
    ],
  }),
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  const quickActions = [
    {
      icon: UtensilsCrossed,
      title: "View Recipes",
      description: "Browse and manage your recipes",
      actionLabel: "View Recipes",
      href: "/recipes",
      testId: "quick-action-recipes",
    },
    {
      icon: Calendar,
      title: "Create Meal Plan",
      description: "Plan your weekly meals",
      actionLabel: "Create Plan",
      href: "/meal-plans",
      testId: "quick-action-meal-plans",
    },
    {
      icon: ShoppingCart,
      title: "Shopping List",
      description: "Organize your shopping",
      actionLabel: "View List",
      href: "/shopping-list",
      testId: "quick-action-shopping-list",
    },
    {
      icon: Briefcase,
      title: "Your Items",
      description: "Manage your food items",
      actionLabel: "View Items",
      href: "/items",
      testId: "quick-action-items",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Hi, {currentUser?.full_name || currentUser?.email} 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Let's get cooking today.
        </p>
      </div>

      {/* Stats Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Your Activity</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Your Items"
            value="0"
            icon={Briefcase}
            variant="info"
            testId="stat-items"
          />
          <StatCard
            label="Recipes"
            value="0"
            icon={ChefHat}
            variant="success"
            testId="stat-recipes"
          />
          <StatCard
            label="Meal Plans"
            value="0"
            icon={Calendar}
            variant="warning"
            testId="stat-meal-plans"
          />
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.testId}
              icon={action.icon}
              title={action.title}
              description={action.description}
              actionLabel={action.actionLabel}
              href={action.href}
              testId={action.testId}
            />
          ))}
        </div>
      </div>

      {/* Empty State Handler */}
      <div className="mt-6 rounded-lg border border-dashed border-muted bg-muted/50 p-8 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold">Get Started with MealPrepper</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Start creating recipes and meal plans to make the most of MealPrepper.
          </p>
          <RouterLink
            to="/recipes"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Your First Recipe
          </RouterLink>
        </div>
      </div>
    </div>
  )
}
