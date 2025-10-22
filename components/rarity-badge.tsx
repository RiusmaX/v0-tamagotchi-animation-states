import { type AccessoryRarity, getRarityColor, getRarityLabel } from "@/lib/currency"
import { Sparkles } from "lucide-react"

interface RarityBadgeProps {
  rarity: AccessoryRarity
  size?: "sm" | "md" | "lg"
}

export function RarityBadge({ rarity, size = "md" }: RarityBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  const getBgColor = () => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 border-gray-300"
      case "rare":
        return "bg-blue-100 border-blue-300"
      case "epic":
        return "bg-purple-100 border-purple-300"
      case "legendary":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300 animate-pulse"
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-bold ${getBgColor()} ${sizeClasses[size]} ${getRarityColor(rarity)}`}
    >
      {rarity === "legendary" && <Sparkles className={iconSizes[size]} />}
      {getRarityLabel(rarity)}
    </span>
  )
}
