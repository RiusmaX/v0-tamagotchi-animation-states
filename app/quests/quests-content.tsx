"use client"

import { useEffect, useState } from "react"
import { getDailyQuests, claimQuestReward, type Quest } from "@/lib/daily-quests"
import { QuestCard } from "@/components/quest-card"
import { Card } from "@/components/ui/card"
import { Trophy, Sparkles } from "lucide-react"
import { useSound } from "@/hooks/use-sound"
import { emitWalletUpdate } from "@/lib/wallet-events"

export function QuestsContent() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const { play } = useSound()

  const loadQuests = async () => {
    setLoading(true)
    const data = await getDailyQuests()
    setQuests(data)
    setLoading(false)
  }

  useEffect(() => {
    loadQuests()
  }, [])

  const handleClaim = async (questId: string) => {
    setClaimingId(questId)
    const success = await claimQuestReward(questId)

    if (success) {
      play("success", 0.5)
      emitWalletUpdate() // Emit wallet update before reloading quests to ensure wallet updates immediately
      await loadQuests()
    }

    setClaimingId(null)
  }

  const completedCount = quests.filter((q) => q.completed).length
  const claimedCount = quests.filter((q) => q.claimed).length
  const totalCount = quests.length

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <div className="container max-w-4xl mx-auto py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement des quêtes...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mb-2">
            Quêtes Quotidiennes
          </h1>
          <p className="text-muted-foreground text-lg">Complète les missions pour gagner des récompenses !</p>
        </div>

        {/* Stats Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-100/50 to-pink-100/50 border-2">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Quêtes totales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Complétées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{claimedCount}</div>
              <div className="text-sm text-muted-foreground">Réclamées</div>
            </div>
          </div>
        </Card>

        {/* Quests List */}
        <div className="space-y-4">
          {quests.length === 0 ? (
            <Card className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <p className="text-muted-foreground">Aucune quête disponible pour aujourd'hui.</p>
            </Card>
          ) : (
            quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onClaim={handleClaim} isClaiming={claimingId === quest.id} />
            ))
          )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Les quêtes se renouvellent chaque jour à minuit !</p>
        </div>
      </div>
    </main>
  )
}
