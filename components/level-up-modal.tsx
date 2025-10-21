"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trophy, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LevelUpModalProps {
  show: boolean
  newLevel: number
  onClose: () => void
}

export function LevelUpModal({ show, newLevel, onClose }: LevelUpModalProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (show) {
      setOpen(true)
    }
  }, [show])

  const handleClose = () => {
    setOpen(false)
    setTimeout(onClose, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Trophy className="h-20 w-20 text-yellow-500 animate-bounce" />
              <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              <Sparkles className="h-6 w-6 text-yellow-400 absolute -bottom-1 -left-1 animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent tracking-wider">
            NIVEAU SUPÉRIEUR !
          </DialogTitle>
          <DialogDescription className="text-center text-xl font-bold mt-4">
            Ton monstre a atteint le niveau {newLevel} !
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button onClick={handleClose} size="lg" className="font-bold tracking-wider">
            Continuer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
