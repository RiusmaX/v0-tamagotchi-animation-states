"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, Gift } from "lucide-react"
import type { Quest } from "@/lib/daily-quests"
import { getQuestDefinition } from "@/lib/daily-quests"

interface QuestCardProps {
  quest: Quest
  onClaim: (questId: string) => void
  isClaiming: boolean
}

export function QuestCard({ quest, onClaim, isClaiming }: QuestCardProps) {
  const definition = getQuestDefinition(quest.quest_type)

  if (!definition) return null

  const progress = (quest.current_count / quest.target_count) * 100
  const isCompleted = quest.completed
  const isClaimed = quest.claimed

  return (
    <Card className="p-4 border-2 hover:border-purple-300 transition-colors">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">{definition.icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-lg">{definition.title}</h3>
              <p className="text-sm text-muted-foreground">{definition.description}</p>
            </div>
            {isClaimed && (
              <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-bold flex-shrink-0">
                <Check className="h-3 w-3" />
                Réclamé
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                Progression: {quest.current_count}/{quest.target_count}
              </span>
              <span className="font-bold text-purple-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Reward and Action */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Gift className="h-4 w-4 text-yellow-600" />
              <span className="font-bold text-yellow-600">{definition.rewardDescription}</span>
            </div>

            {isCompleted && !isClaimed && (
              <Button
                onClick={() => onClaim(quest.id)}
                disabled={isClaiming}
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
              >
                {isClaiming ? "..." : "Réclamer"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
