"use client"

import { Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getLevelProgress } from "@/lib/xp-system"

interface LevelDisplayProps {
  level: number
  currentXP: number
  xpForNextLevel: number
  className?: string
}

export function LevelDisplay({ level, currentXP, xpForNextLevel, className = "" }: LevelDisplayProps) {
  const progress = getLevelProgress(currentXP, xpForNextLevel)
  const isMaxLevel = xpForNextLevel === 0

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg border-2 border-yellow-600">
        <Trophy className="h-4 w-4" />
        <span className="font-bold text-sm tracking-wider">NIV. {level}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-muted-foreground tracking-wider">
            {isMaxLevel ? "NIVEAU MAX" : "XP"}
          </span>
          {!isMaxLevel && (
            <span className="text-xs font-bold text-muted-foreground tracking-wider">
              {currentXP} / {xpForNextLevel}
            </span>
          )}
        </div>
        <Progress value={progress} className="h-2 bg-muted" />
      </div>
    </div>
  )
}
