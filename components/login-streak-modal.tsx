"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Coins, Flame } from "lucide-react"
import { useSound } from "@/hooks/use-sound"

interface LoginStreakModalProps {
  streak: number
  coinsEarned: number
  message: string
  onClose: () => void
}

export function LoginStreakModal({ streak, coinsEarned, message, onClose }: LoginStreakModalProps) {
  const [open, setOpen] = useState(true)
  const { play } = useSound()

  useEffect(() => {
    if (open && coinsEarned > 0) {
      play("success", 0.5)
      setTimeout(() => {
        play("coin", 0.4)
      }, 300)
    }
  }, [open, coinsEarned, play])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Flame className="h-6 w-6 text-orange-500" />
            Connexion quotidienne
          </DialogTitle>
          <DialogDescription className="sr-only">Récompense de connexion quotidienne</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* Streak Display */}
          <div className="flex items-center gap-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-all ${
                  i < streak ? "bg-gradient-to-r from-orange-500 to-red-500 scale-110" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Streak Counter */}
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              {streak}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{streak === 1 ? "jour" : "jours"} consécutifs</div>
          </div>

          {/* Coins Earned */}
          {coinsEarned > 0 && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-3 rounded-full">
              <Coins className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold">+{coinsEarned}</span>
            </div>
          )}

          {/* Message */}
          <p className="text-center text-sm text-muted-foreground max-w-xs">{message}</p>

          {/* Progress Info */}
          <div className="text-xs text-center text-muted-foreground bg-muted px-4 py-2 rounded-lg">
            {streak < 7 ? (
              <>
                Encore {7 - streak} {7 - streak === 1 ? "jour" : "jours"} pour gagner 5 pièces !
              </>
            ) : (
              <>Félicitations ! Revenez demain pour recommencer !</>
            )}
          </div>
        </div>

        <Button onClick={handleClose} className="w-full">
          Continuer
        </Button>
      </DialogContent>
    </Dialog>
  )
}
