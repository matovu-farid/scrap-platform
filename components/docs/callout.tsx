import type { ReactNode } from "react"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

interface CalloutProps {
  children: ReactNode
  type: "info" | "warning" | "success"
}

export function Callout({ children, type = "info" }: CalloutProps) {
  const icons = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle,
  }

  const Icon = icons[type]

  return (
    <div
      className={`p-4 rounded-lg flex items-start space-x-3 ${
        type === "info"
          ? "bg-blue-100 text-blue-800"
          : type === "warning"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
      }`}
    >
      <Icon className="w-5 h-5 mt-1 flex-shrink-0" />
      <div>{children}</div>
    </div>
  )
}

