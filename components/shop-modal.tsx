"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ACCESSORIES,
  type Accessory,
  type AccessoryType,
  getUserCoins,
  spendCoins,
  getRarityBorderColor,
  getRarityBackground,
} from "@/lib/currency"
import { Coins, Check, Zap } from "lucide-react"
import { Toast, ToastContainer } from "@/components/ui/toast"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackgroundShop } from "@/components/background-shop"
import { RarityBadge } from "@/components/rarity-badge"
import { AccessoryPreview } from "@/components/accessory-preview"
import { addXP } from "@/lib/xp-system"

const XP_PACKAGES = [
  {
    id: "xp_small",
    name: "Petit Boost XP",
    description: "Un petit coup de pouce pour progresser",
    xp: 50,
    price: 10,
    icon: "⚡",
  },
  {
    id: "xp_medium",
    name: "Boost XP Moyen",
    description: "Accélérez votre progression",
    xp: 150,
    price: 25,
    icon: "✨",
  },
  {
    id: "xp_large",
    name: "Grand Boost XP",
    description: "Un boost significatif d'expérience",
    xp: 300,
    price: 45,
    icon: "💫",
  },
  {
    id: "xp_mega",
    name: "Méga Boost XP",
    description: "Montez de niveau rapidement !",
    xp: 500,
    price: 70,
    icon: "🌟",
  },
  {
    id: "xp_ultra",
    name: "Ultra Boost XP",
    description: "Le boost ultime pour les champions",
    xp: 1000,
    price: 120,
    icon: "⭐",
  },
  {
    id: "xp_legendary",
    name: "Boost XP Légendaire",
    description: "Devenez une légende instantanément !",
    xp: 2500,
    price: 250,
    icon: "🔥",
  },
]

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
  current_background: string
  owned_backgrounds: string[]
}

const getOwnedColumnName = (type: AccessoryType): keyof MonsterAccessories => {
  const columnMap: Record<AccessoryType, keyof MonsterAccessories> = {
    hat: "owned_hats",
    glasses: "owned_glasses",
    shoes: "owned_shoes",
  }
  return columnMap[type]
}

const getEquippedColumnName = (type: AccessoryType): keyof MonsterAccessories => {
  const columnMap: Record<AccessoryType, keyof MonsterAccessories> = {
    hat: "equipped_hat",
    glasses: "equipped_glasses",
    shoes: "equipped_shoes",
  }
  return columnMap[type]
}

export function ShopModal({ open, onOpenChange, monsterId, onAccessoryEquipped }: ShopModalProps) {
  const [coins, setCoins] = useState(0)
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [monsterAccessories, setMonsterAccessories] = useState<MonsterAccessories | null>(null)
  const [monsterXP, setMonsterXP] = useState({ level: 1, xp: 0, total_xp: 0 })
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
      loadMonsterXP()
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
      .select(
        "equipped_hat, equipped_glasses, equipped_shoes, owned_hats, owned_glasses, owned_shoes, current_background, owned_backgrounds",
      )
      .eq("id", monsterId)
      .single()

    if (error) {
      console.error("[v0] Error loading monster accessories:", error)
      return
    }

    setMonsterAccessories(data)
  }

  const loadMonsterXP = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("monsters").select("level, xp, total_xp").eq("id", monsterId).single()

    if (error) {
      console.error("[v0] Error loading monster XP:", error)
      return
    }

    setMonsterXP({
      level: data.level || 1,
      xp: data.xp || 0,
      total_xp: data.total_xp || 0,
    })
  }

  const handleAction = async (accessory: Accessory) => {
    if (purchasing) return

    const isOwned = isAccessoryOwned(accessory)
    const isEquipped = isAccessoryEquipped(accessory)

    if (isEquipped) {
      await handleUnequip(accessory)
      return
    }

    if (isOwned) {
      await handleEquip(accessory)
      return
    }

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

    const { data: currentData } = await supabase.from("monsters").select(ownedColumn).eq("id", monsterId).single()

    const currentOwned = (currentData?.[ownedColumn] as string[]) || []
    const newOwned = [...currentOwned, accessory.id]

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

  const handlePurchaseXP = async (xpPackage: (typeof XP_PACKAGES)[0]) => {
    if (coins < xpPackage.price) {
      setToast({
        show: true,
        title: "Pas assez de coins",
        description: `Il vous faut ${xpPackage.price} coins pour acheter ce boost XP.`,
        variant: "error",
      })
      setTimeout(() => setToast(null), 3000)
      return
    }

    setPurchasing(true)

    const success = await spendCoins(xpPackage.price)

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

    const xpResult = addXP(monsterXP.total_xp, xpPackage.xp)

    const supabase = createClient()
    const { error } = await supabase
      .from("monsters")
      .update({
        level: xpResult.newLevel,
        xp: xpResult.newCurrentXP,
        total_xp: xpResult.newTotalXP,
      })
      .eq("id", monsterId)

    if (error) {
      console.error("[v0] Error updating monster XP:", error)
      setToast({
        show: true,
        title: "Erreur",
        description: "Une erreur est survenue lors de l'achat du boost XP.",
        variant: "error",
      })
      setPurchasing(false)
      setTimeout(() => setToast(null), 3000)
      return
    }

    await loadCoins()
    await loadMonsterXP()
    setPurchasing(false)
    onAccessoryEquipped()

    const levelUpMessage = xpResult.leveledUp ? ` Vous êtes passé au niveau ${xpResult.newLevel} !` : ""

    setToast({
      show: true,
      title: "Boost XP acheté !",
      description: `+${xpPackage.xp} XP ajoutés avec succès.${levelUpMessage}`,
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

  const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 }
  Object.keys(groupedAccessories).forEach((type) => {
    groupedAccessories[type as AccessoryType].sort((a, b) => {
      const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
      if (rarityDiff !== 0) return rarityDiff
      return a.price - b.price
    })
  })

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
              Boutique
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="accessories" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="accessories">Accessoires</TabsTrigger>
              <TabsTrigger value="backgrounds">Arrière-plans</TabsTrigger>
              <TabsTrigger value="xp">Boost XP</TabsTrigger>
            </TabsList>

            <TabsContent value="accessories" className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-yellow-400 shadow-md w-fit mx-auto">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                <span className="font-bold text-lg sm:text-xl text-yellow-800">{coins}</span>
              </div>

              <Tabs defaultValue="hat" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="hat">Chapeaux</TabsTrigger>
                  <TabsTrigger value="glasses">Lunettes</TabsTrigger>
                  <TabsTrigger value="shoes">Chaussures</TabsTrigger>
                </TabsList>

                {Object.entries(groupedAccessories).map(([type, accessories]) => (
                  <TabsContent key={type} value={type} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {accessories.map((accessory) => {
                        const isOwned = isAccessoryOwned(accessory)
                        const isEquipped = isAccessoryEquipped(accessory)

                        return (
                          <Card
                            key={accessory.id}
                            className={`p-3 sm:p-4 hover:shadow-lg transition-all border-2 ${getRarityBorderColor(accessory.rarity)} ${getRarityBackground(accessory.rarity)} ${
                              isEquipped ? "ring-2 ring-green-500 ring-offset-2" : ""
                            } ${accessory.rarity === "legendary" ? "animate-pulse" : ""} relative`}
                          >
                            {isEquipped && (
                              <span className="absolute top-2 right-2 flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold shadow-md z-10">
                                <Check className="h-3 w-3" />
                                Équipé
                              </span>
                            )}
                            {isOwned && !isEquipped && (
                              <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold shadow-md z-10">
                                Possédé
                              </span>
                            )}

                            <div className="space-y-2">
                              <div className="mb-2">
                                <AccessoryPreview accessoryId={accessory.id} rarity={accessory.rarity} />
                              </div>

                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-bold text-base sm:text-lg mb-1">{accessory.name}</h4>
                                  <RarityBadge rarity={accessory.rarity} size="sm" />
                                </div>
                                {!isOwned && (
                                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                                    <Coins className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                                    <span className="font-bold text-xs sm:text-sm text-yellow-800">
                                      {accessory.price}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs sm:text-sm text-muted-foreground">{accessory.description}</p>

                              <Button
                                onClick={() => handleAction(accessory)}
                                disabled={purchasing || (!isOwned && coins < accessory.price)}
                                className="w-full text-sm sm:text-base"
                                size="sm"
                                variant={getButtonVariant(accessory)}
                              >
                                {getButtonText(accessory)}
                              </Button>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            <TabsContent value="backgrounds">
              <BackgroundShop
                monsterId={monsterId}
                currentBackground={monsterAccessories?.current_background || "default"}
                ownedBackgrounds={monsterAccessories?.owned_backgrounds || ["default"]}
                onBackgroundChanged={async () => {
                  await loadMonsterAccessories()
                  onAccessoryEquipped()
                }}
              />
            </TabsContent>

            <TabsContent value="xp" className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-yellow-400 shadow-md w-fit mx-auto">
                <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                <span className="font-bold text-lg sm:text-xl text-yellow-800">{coins}</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-purple-100 to-blue-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-purple-400 shadow-md w-fit mx-auto">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                <span className="font-bold text-base sm:text-lg text-purple-800">
                  Niveau {monsterXP.level} • {monsterXP.xp} XP
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {XP_PACKAGES.map((xpPackage) => {
                  const canAfford = coins >= xpPackage.price

                  return (
                    <Card
                      key={xpPackage.id}
                      className="p-3 sm:p-4 hover:shadow-lg transition-all border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 hover:scale-105"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <div className="text-5xl sm:text-6xl">{xpPackage.icon}</div>
                        </div>

                        <div className="text-center">
                          <h4 className="font-bold text-base sm:text-lg mb-1">{xpPackage.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">{xpPackage.description}</p>

                          <div className="flex items-center justify-center gap-1 bg-purple-100 px-3 py-1 rounded-full mb-2 w-fit mx-auto">
                            <Zap className="h-4 w-4 text-purple-600" />
                            <span className="font-bold text-sm text-purple-800">+{xpPackage.xp} XP</span>
                          </div>

                          <div className="flex items-center justify-center gap-1 bg-yellow-100 px-3 py-1 rounded-full w-fit mx-auto">
                            <Coins className="h-4 w-4 text-yellow-600" />
                            <span className="font-bold text-sm text-yellow-800">{xpPackage.price}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handlePurchaseXP(xpPackage)}
                          disabled={purchasing || !canAfford}
                          className="w-full text-sm sm:text-base bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                          size="sm"
                        >
                          {purchasing ? "..." : canAfford ? "Acheter" : "Pas assez"}
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
