"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SPECIAL_ANIMATIONS, getUnlockedAnimations } from "@/lib/animation-unlocks"
import { Badge } from "@/components/ui/badge"
import { Lock, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface AnimationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level: number
  totalXP: number
}

export function AnimationsModal({ open, onOpenChange, level, totalXP }: AnimationsModalProps) {
  const unlockedAnimations = getUnlockedAnimations(level)
  const unlockedIds = new Set(unlockedAnimations.map((a) => a.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Animations Spéciales
          </DialogTitle>
          <DialogDescription>
            Débloquez des animations uniques en augmentant le niveau de votre monstre !
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {SPECIAL_ANIMATIONS.map((animation) => {
            const isUnlocked = unlockedIds.has(animation.id)
            const progress = isUnlocked ? 100 : Math.min((level / animation.unlockLevel) * 100, 99)

            return (
              <div
                key={animation.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300"
                    : "bg-muted/50 border-muted"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{animation.icon}</span>
                      <h3 className="font-bold text-lg">{animation.name}</h3>
                      {isUnlocked ? (
                        <Badge className="bg-green-500 text-white">Débloqué</Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Niveau {animation.unlockLevel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{animation.description}</p>
                    {!isUnlocked && (
                      <div className="space-y-1">
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Niveau {level} / {animation.unlockLevel}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <p className="text-sm text-center font-medium text-blue-900">
            💡 Les animations spéciales s'activent automatiquement quand vous effectuez l'action correspondante !
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
