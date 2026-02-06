import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  variant?: "default" | "success" | "warning" | "info"
  testId?: string
}

const variantStyles = {
  default: "bg-slate-100 text-slate-900",
  success: "bg-green-100 text-green-900",
  warning: "bg-yellow-100 text-yellow-900",
  info: "bg-blue-100 text-blue-900",
}

const iconVariantStyles = {
  default: "text-slate-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  testId,
}: StatCardProps) {
  return (
    <div
      className={`rounded-lg p-4 transition-shadow hover:shadow-md ${variantStyles[variant]}`}
      data-testid={testId}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`size-6 ${iconVariantStyles[variant]}`} />
      </div>
    </div>
  )
}
