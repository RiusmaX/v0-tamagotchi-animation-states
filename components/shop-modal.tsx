"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ACCESSORIES, type Accessory, type AccessoryType, getUserCoins, spendCoins } from "@/lib/currency"
import { Coins, ShoppingBag, Check } from "lucide-react"
import { Toast, ToastContainer } from "@/components/ui/toast"
import { createClient } from "@/lib/supabase/client"

interface ShopModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  monsterId: string
  onAccessoryEquipped: () => void
}

interface MonsterAccessories {
  equipped_hat: string | null
  equipped_glasses: string | null
  equipped_shoes: string | null
  owned_hats: string[]
  owned_glasses: string[]
  owned_shoes: string[]
}

const getOwnedColumnName = (type: AccessoryType): keyof MonsterAccessories => {
  const columnMap: Record<AccessoryType, keyof MonsterAccessories> = {
    hat: "owned_hats",
    glasses: "owned_glasses",
    shoe: "owned_shoes",
  }
  return columnMap[type]
}

const getEquippedColumnName = (type: AccessoryType): keyof MonsterAccessories => {
  const columnMap: Record<AccessoryType, keyof MonsterAccessories> = {
    hat: "equipped_hat",
    glasses: "equipped_glasses",
    shoe: "equipped_shoes",
  }
  return columnMap[type]
}

export function ShopModal({ open, onOpenChange, monsterId, onAccessoryEquipped }: ShopModalProps) {
  const [coins, setCoins] = useState(0)
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [monsterAccessories, setMonsterAccessories] = useState<MonsterAccessories | null>(null)
  const [toast, setToast] = useState<{
    show: boolean
    title: string
    description: string
    variant: "success" | "error"
  } | null>(null)

  useEffect(() => {
    if (open) {
      loadCoins()
      loadMonsterAccessories()
    }
  }, [open])

  const loadCoins = async () => {
    const userCoins = await getUserCoins()
    setCoins(userCoins)
  }

  const loadMonsterAccessories = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("monsters")
      .select("equipped_hat, equipped_glasses, equipped_shoes, owned_hats, owned_glasses, owned_shoes")
      .eq("id", monsterId)
      .single()

    if (error) {
      console.error("[v0] Error loading monster accessories:", error)
      return
    }

    setMonsterAccessories(data)
  }

  const handleAction = async (accessory: Accessory) => {
    if (purchasing) return

    const isOwned = isAccessoryOwned(accessory)
    const isEquipped = isAccessoryEquipped(accessory)

    // If already equipped, unequip it
    if (isEquipped) {
      await handleUnequip(accessory)
      return
    }

    // If owned but not equipped, equip it for free
    if (isOwned) {
      await handleEquip(accessory)
      return
    }

    // If not owned, purchase it
    await handlePurchase(accessory)
  }

  const isAccessoryOwned = (accessory: Accessory): boolean => {
    if (!monsterAccessories) return false
    const ownedKey = getOwnedColumnName(accessory.type)
    const owned = monsterAccessories[ownedKey] as string[]
    return owned?.includes(accessory.id) || false
  }

  const isAccessoryEquipped = (accessory: Accessory): boolean => {
    if (!monsterAccessories) return false
    const equippedKey = getEquippedColumnName(accessory.type)
    return monsterAccessories[equippedKey] === accessory.id
  }

  const handleEquip = async (accessory: Accessory) => {
    setPurchasing(true)
    setSelectedAccessory(accessory)

    const supabase = createClient()
    const columnName = getEquippedColumnName(accessory.type)

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

    await loadMonsterAccessories()
    setPurchasing(false)
    setSelectedAccessory(null)
    onAccessoryEquipped()

    setToast({
      show: true,
      title: "Équipé !",
      description: `${accessory.name} a été équipé avec succès.`,
      variant: "success",
    })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUnequip = async (accessory: Accessory) => {
    setPurchasing(true)
    setSelectedAccessory(accessory)

    const supabase = createClient()
    const columnName = getEquippedColumnName(accessory.type)

    const { error } = await supabase
      .from("monsters")
      .update({ [columnName]: null })
      .eq("id", monsterId)

    if (error) {
      console.error("[v0] Error unequipping accessory:", error)
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors du retrait de l'accessoire.",
        variant: "error",
      })
      setPurchasing(false)
      setTimeout(() => setToast(null), 3000)
      return
    }

    await loadMonsterAccessories()
    setPurchasing(false)
    setSelectedAccessory(null)
    onAccessoryEquipped()

    setToast({
      show: true,
      title: "Retiré !",
      description: `${accessory.name} a été retiré.`,
      variant: "success",
    })
    setTimeout(() => setToast(null), 3000)
  }

  const handlePurchase = async (accessory: Accessory) => {
    if (coins < accessory.price) {
      setToast({
        show: true,
        title: "Pas assez de coins",
        description: `Il vous faut ${accessory.price} coins pour acheter cet accessoire.`,
        variant: "error",
      })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setPurchasing(true)
    setSelectedAccessory(accessory)

    // Spend coins
    const success = await spendCoins(accessory.price)

    if (!success) {
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement.",
        variant: "error",
      })
      setPurchasing(false)
      setTimeout(() => setToast(null), 3000)
      return
    }

    const supabase = createClient()
    const ownedColumn = getOwnedColumnName(accessory.type)
    const equippedColumn = getEquippedColumnName(accessory.type)

    // Get current owned accessories
    const { data: currentData } = await supabase.from("monsters").select(ownedColumn).eq("id", monsterId).single()

    const currentOwned = (currentData?.[ownedColumn] as string[]) || []
    const newOwned = [...currentOwned, accessory.id]

    // Update both owned and equipped
    const { error } = await supabase
      .from("monsters")
      .update({
        [ownedColumn]: newOwned,
        [equippedColumn]: accessory.id,
      })
      .eq("id", monsterId)

    if (error) {
      console.error("[v0] Error purchasing accessory:", error)
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors de l'achat de l'accessoire.",
        variant: "error",
      })
      setPurchasing(false)
      setTimeout(() => setToast(null), 3000)
      return
    }

    // Refresh data
    await loadCoins()
    await loadMonsterAccessories()
    setPurchasing(false)
    setSelectedAccessory(null)
    onAccessoryEquipped()

    setToast({
      show: true,
      title: "Achat réussi !",
      description: `${accessory.name} a été acheté et équipé avec succès.`,
      variant: "success",
    })
    setTimeout(() => setToast(null), 3000)
  }

  const getButtonText = (accessory: Accessory): string => {
    if (purchasing && selectedAccessory?.id === accessory.id) {
      return "..."
    }
    if (isAccessoryEquipped(accessory)) {
      return "Retirer"
    }
    if (isAccessoryOwned(accessory)) {
      return "Équiper"
    }
    if (coins >= accessory.price) {
      return "Acheter"
    }
    return "Pas assez"
  }

  const getButtonVariant = (accessory: Accessory): "default" | "secondary" | "outline" => {
    if (isAccessoryEquipped(accessory)) {
      return "outline"
    }
    if (isAccessoryOwned(accessory)) {
      return "default"
    }
    if (coins >= accessory.price) {
      return "default"
    }
    return "secondary"
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
                  {accessories.map((accessory) => {
                    const isOwned = isAccessoryOwned(accessory)
                    const isEquipped = isAccessoryEquipped(accessory)

                    return (
                      <Card
                        key={accessory.id}
                        className={`p-3 sm:p-4 hover:shadow-lg transition-shadow ${isEquipped ? "ring-2 ring-green-500" : ""}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 mr-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-base sm:text-lg">{accessory.name}</h4>
                              {isEquipped && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                  <Check className="h-3 w-3" />
                                  Équipé
                                </span>
                              )}
                              {isOwned && !isEquipped && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                  Possédé
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">{accessory.description}</p>
                          </div>
                          {!isOwned && (
                            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full flex-shrink-0">
                              <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                              <span className="font-bold text-xs sm:text-sm text-yellow-800">{accessory.price}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAction(accessory)}
                          disabled={purchasing || (!isOwned && coins < accessory.price)}
                          className="w-full mt-2 text-sm sm:text-base"
                          size="sm"
                          variant={getButtonVariant(accessory)}
                        >
                          {getButtonText(accessory)}
                        </Button>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
