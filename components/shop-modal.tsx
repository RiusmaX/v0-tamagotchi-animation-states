"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ACCESSORIES, type Accessory, type AccessoryType, getUserCoins, spendCoins } from "@/lib/currency"
import { Coins, ShoppingBag } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Toast, ToastContainer } from "@/components/ui/toast"

interface ShopModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  monsterId: string
  onAccessoryEquipped: () => void
}

export function ShopModal({ open, onOpenChange, monsterId, onAccessoryEquipped }: ShopModalProps) {
  const [coins, setCoins] = useState(0)
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [toast, setToast] = useState<{
    show: boolean
    title: string
    description: string
    variant: "success" | "error"
  } | null>(null)

  useEffect(() => {
    if (open) {
      loadCoins()
    }
  }, [open])

  const loadCoins = async () => {
    const userCoins = await getUserCoins()
    setCoins(userCoins)
  }

  const handlePurchase = async (accessory: Accessory) => {
    if (purchasing || coins < accessory.price) return

    setPurchasing(true)
    setSelectedAccessory(accessory)

    // Spend coins
    const success = await spendCoins(accessory.price)

    if (!success) {
      setToast({
        show: true,
        title: "Pas assez de coins",
        description: `Il vous faut ${accessory.price} coins pour acheter cet accessoire.`,
        variant: "error",
      })
      setPurchasing(false)
      setTimeout(() => setToast(null), 3000)
      return
    }

    // Equip accessory on monster
    const supabase = createClient()
    const columnName = `equipped_${accessory.type}`

    const { error } = await supabase
      .from("monsters")
      .update({ [columnName]: accessory.id })
      .eq("id", monsterId)

    if (error) {
      console.error("[v0] Error equipping accessory:", error)
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors de l'équipement de l'accessoire.",
        variant: "error",
      })
      setPurchasing(false)
      setTimeout(() => setToast(null), 3000)
      return
    }

    // Refresh coins
    await loadCoins()
    setPurchasing(false)
    setSelectedAccessory(null)

    // Notify parent to refresh monster data
    onAccessoryEquipped()

    setToast({
      show: true,
      title: "Achat réussi !",
      description: `${accessory.name} a été équipé avec succès sur votre monstre.`,
      variant: "success",
    })
    setTimeout(() => setToast(null), 3000)
  }

  const groupedAccessories = ACCESSORIES.reduce(
    (acc, accessory) => {
      if (!acc[accessory.type]) acc[accessory.type] = []
      acc[accessory.type].push(accessory)
      return acc
    },
    {} as Record<AccessoryType, Accessory[]>,
  )

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

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-full sm:max-w-[90vw] md:max-w-5xl max-h-[95vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
              Boutique d&apos;accessoires
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-yellow-400 shadow-md w-fit mx-auto">
            <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            <span className="font-bold text-lg sm:text-xl text-yellow-800">{coins}</span>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {Object.entries(groupedAccessories).map(([type, accessories]) => (
              <div key={type}>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 capitalize flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                  {type === "hat" ? "Chapeaux" : type === "glasses" ? "Lunettes" : "Chaussures"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {accessories.map((accessory) => (
                    <Card key={accessory.id} className="p-3 sm:p-4 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 mr-2">
                          <h4 className="font-bold text-base sm:text-lg">{accessory.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{accessory.description}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full flex-shrink-0">
                          <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                          <span className="font-bold text-xs sm:text-sm text-yellow-800">{accessory.price}</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handlePurchase(accessory)}
                        disabled={purchasing || coins < accessory.price}
                        className="w-full mt-2 text-sm sm:text-base"
                        size="sm"
                        variant={coins >= accessory.price ? "default" : "secondary"}
                      >
                        {purchasing && selectedAccessory?.id === accessory.id
                          ? "Achat..."
                          : coins >= accessory.price
                            ? "Acheter"
                            : "Pas assez"}
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
