import { Link as RouterLink } from "@tanstack/react-router"
import { LucideIcon } from "lucide-react"

interface QuickActionCardProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel: string
  href: string
  variant?: "default" | "secondary"
  badge?: string
  testId?: string
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  actionLabel,
  href,
  variant = "default",
  badge,
  testId,
}: QuickActionCardProps) {
  const cardClasses =
    variant === "secondary"
      ? "bg-secondary border-secondary/50"
      : "bg-card border-border"

  return (
    <div
      className={`rounded-lg border ${cardClasses} p-6 hover:shadow-md transition-shadow relative`}
      data-testid={testId}
    >
      {badge && (
        <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
          {badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Icon className="h-8 w-8 text-primary shrink-0 mt-1" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="font-semibold text-base leading-tight">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>

      <RouterLink to={href}>
        <button className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1">
          {actionLabel}
          <span aria-hidden="true">→</span>
        </button>
      </RouterLink>
    </div>
  )
}
