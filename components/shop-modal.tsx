"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ACCESSORIES, type Accessory, type AccessoryType, getUserCoins, spendCoins } from "@/lib/currency"
import { Coins, ShoppingBag } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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
      alert("Pas assez de coins!")
      setPurchasing(false)
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
      alert("Erreur lors de l'équipement de l'accessoire")
      setPurchasing(false)
      return
    }

    // Refresh coins
    await loadCoins()
    setPurchasing(false)
    setSelectedAccessory(null)

    // Notify parent to refresh monster data
    onAccessoryEquipped()

    alert(`${accessory.name} équipé avec succès!`)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
            Boutique d&apos;accessoires
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 px-6 py-3 rounded-full border-2 border-yellow-400 shadow-md w-fit mx-auto">
          <Coins className="h-6 w-6 text-yellow-600" />
          <span className="font-bold text-xl text-yellow-800">{coins}</span>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedAccessories).map(([type, accessories]) => (
            <div key={type}>
              <h3 className="text-xl font-bold mb-3 capitalize flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {type === "hat" ? "Chapeaux" : type === "glasses" ? "Lunettes" : "Chaussures"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accessories.map((accessory) => (
                  <Card key={accessory.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{accessory.name}</h4>
                        <p className="text-sm text-muted-foreground">{accessory.description}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="font-bold text-yellow-800">{accessory.price}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePurchase(accessory)}
                      disabled={purchasing || coins < accessory.price}
                      className="w-full mt-2"
                      variant={coins >= accessory.price ? "default" : "secondary"}
                    >
                      {purchasing && selectedAccessory?.id === accessory.id
                        ? "Achat en cours..."
                        : coins >= accessory.price
                          ? "Acheter et équiper"
                          : "Pas assez de coins"}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
