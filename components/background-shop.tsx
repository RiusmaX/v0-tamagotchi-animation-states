"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BACKGROUNDS, type Background } from "@/lib/backgrounds"
import { Coins, Check, Sparkles } from "lucide-react"
import { getUserCoins, spendCoins } from "@/lib/currency"
import { createClient } from "@/lib/supabase/client"
import { Toast, ToastContainer } from "@/components/ui/toast"

interface BackgroundShopProps {
  monsterId: string
  currentBackground: string
  ownedBackgrounds: string[]
  onBackgroundChanged: () => void
}

export function BackgroundShop({
  monsterId,
  currentBackground,
  ownedBackgrounds,
  onBackgroundChanged,
}: BackgroundShopProps) {
  const [coins, setCoins] = useState(0)
  const [purchasing, setPurchasing] = useState(false)
  const [selectedBg, setSelectedBg] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    show: boolean
    title: string
    description: string
    variant: "success" | "error"
  } | null>(null)

  useEffect(() => {
    loadCoins()
  }, [])

  const loadCoins = async () => {
    const userCoins = await getUserCoins()
    setCoins(userCoins)
  }

  const isOwned = (bgId: string) => ownedBackgrounds.includes(bgId)
  const isCurrent = (bgId: string) => currentBackground === bgId

  const handleAction = async (background: Background) => {
    if (purchasing) return

    if (isCurrent(background.id)) {
      return
    }

    if (isOwned(background.id)) {
      await handleApply(background)
    } else {
      await handlePurchase(background)
    }
  }

  const handleApply = async (background: Background) => {
    setPurchasing(true)
    setSelectedBg(background.id)

    const supabase = createClient()
    const { error } = await supabase.from("monsters").update({ current_background: background.id }).eq("id", monsterId)

    if (error) {
      console.error("[v0] Error applying background:", error)
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors de l'application de l'arrière-plan.",
        variant: "error",
      })
      setPurchasing(false)
      setSelectedBg(null)
      setTimeout(() => setToast(null), 3000)
      return
    }

    setPurchasing(false)
    setSelectedBg(null)
    onBackgroundChanged()

    setToast({
      show: true,
      title: "Appliqué !",
      description: `${background.name} a été appliqué avec succès.`,
      variant: "success",
    })
    setTimeout(() => setToast(null), 3000)
  }

  const handlePurchase = async (background: Background) => {
    if (coins < background.price) {
      setToast({
        show: true,
        title: "Pas assez de coins",
        description: `Il vous faut ${background.price} coins pour acheter cet arrière-plan.`,
        variant: "error",
      })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setPurchasing(true)
    setSelectedBg(background.id)

    const success = await spendCoins(background.price)

    if (!success) {
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement.",
        variant: "error",
      })
      setPurchasing(false)
      setSelectedBg(null)
      setTimeout(() => setToast(null), 3000)
      return
    }

    const supabase = createClient()
    const newOwned = [...ownedBackgrounds, background.id]

    const { error } = await supabase
      .from("monsters")
      .update({
        owned_backgrounds: newOwned,
        current_background: background.id,
      })
      .eq("id", monsterId)

    if (error) {
      console.error("[v0] Error purchasing background:", error)
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors de l'achat de l'arrière-plan.",
        variant: "error",
      })
      setPurchasing(false)
      setSelectedBg(null)
      setTimeout(() => setToast(null), 3000)
      return
    }

    await loadCoins()
    setPurchasing(false)
    setSelectedBg(null)
    onBackgroundChanged()

    setToast({
      show: true,
      title: "Achat réussi !",
      description: `${background.name} a été acheté et appliqué avec succès.`,
      variant: "success",
    })
    setTimeout(() => setToast(null), 3000)
  }

  const getButtonText = (background: Background): string => {
    if (purchasing && selectedBg === background.id) {
      return "..."
    }
    if (isCurrent(background.id)) {
      return "En cours"
    }
    if (isOwned(background.id)) {
      return "Appliquer"
    }
    if (coins >= background.price) {
      return "Acheter"
    }
    return "Pas assez"
  }

  const getButtonVariant = (background: Background): "default" | "secondary" | "outline" => {
    if (isCurrent(background.id)) {
      return "outline"
    }
    if (isOwned(background.id)) {
      return "default"
    }
    if (coins >= background.price) {
      return "default"
    }
    return "secondary"
  }

  return (
    <>
      {toast?.show && (
        <ToastContainer>
          <Toast
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        </ToastContainer>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            Arrière-plans
          </h3>
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1.5 rounded-full border-2 border-yellow-400">
            <Coins className="h-4 w-4 text-yellow-600" />
            <span className="font-bold text-sm text-yellow-800">{coins}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {BACKGROUNDS.map((background) => {
            const owned = isOwned(background.id)
            const current = isCurrent(background.id)

            return (
              <Card
                key={background.id}
                className={`p-3 sm:p-4 hover:shadow-lg transition-shadow ${current ? "ring-2 ring-green-500" : ""} relative`}
              >
                {current && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold shadow-md z-10">
                    <Check className="h-3 w-3" />
                    Actif
                  </span>
                )}
                {owned && !current && (
                  <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold shadow-md z-10">
                    Possédé
                  </span>
                )}

                <div
                  className={`w-full h-24 sm:h-32 rounded-lg mb-3 flex items-center justify-center text-4xl sm:text-5xl border-2 border-border bg-cover bg-center ${!background.imageUrl ? `bg-gradient-to-br ${background.gradient}` : ""}`}
                  style={background.imageUrl ? { backgroundImage: `url(${background.imageUrl})` } : undefined}
                >
                  {background.pattern && !background.imageUrl && <span>{background.pattern}</span>}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 mr-2">
                    <h4 className="font-bold text-sm sm:text-base">{background.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{background.description}</p>
                  </div>
                  {!owned && background.price > 0 && (
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full flex-shrink-0">
                      <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                      <span className="font-bold text-xs sm:text-sm text-yellow-800">{background.price}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleAction(background)}
                  disabled={purchasing || current || (!owned && coins < background.price)}
                  className="w-full text-sm"
                  size="sm"
                  variant={getButtonVariant(background)}
                >
                  {getButtonText(background)}
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </>
  )
}
