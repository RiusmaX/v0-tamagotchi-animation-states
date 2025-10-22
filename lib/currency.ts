import { createClient } from "@/lib/supabase/client"
import { walletEvents } from "@/lib/wallet-events"

export async function getUserCoins(): Promise<number> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return 0

  const { data, error } = await supabase.from("user_profiles").select("coins").eq("user_id", user.id).maybeSingle()

  if (error) {
    console.error("[v0] Error fetching user coins:", error)
    return 0
  }

  if (!data) {
    const { error: insertError } = await supabase.from("user_profiles").insert({ user_id: user.id, coins: 10 })

    if (insertError) {
      console.error("[v0] Error creating user profile:", insertError)
      return 0
    }

    return 10
  }

  return data.coins || 0
}

export async function addCoins(amount: number): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase.from("user_profiles").select("coins").eq("user_id", user.id).maybeSingle()

  if (!profile) {
    await supabase.from("user_profiles").insert({ user_id: user.id, coins: amount })
    walletEvents.emit(amount)
    return true
  }

  const newCoins = profile.coins + amount
  const { error } = await supabase.from("user_profiles").update({ coins: newCoins }).eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error adding coins:", error)
    return false
  }

  walletEvents.emit(newCoins)
  return true
}

export async function spendCoins(amount: number): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase.from("user_profiles").select("coins").eq("user_id", user.id).maybeSingle()

  if (!profile || profile.coins < amount) {
    return false
  }

  const newCoins = profile.coins - amount
  const { error } = await supabase.from("user_profiles").update({ coins: newCoins }).eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error spending coins:", error)
    return false
  }

  walletEvents.emit(newCoins)
  return true
}

export type AccessoryType = "hat" | "glasses" | "shoes"
export type AccessoryRarity = "common" | "rare" | "epic" | "legendary"

export interface Accessory {
  id: string
  name: string
  type: AccessoryType
  price: number
  description: string
  rarity: AccessoryRarity
  emoji: string // Added emoji field for visual display
}

export const ACCESSORIES: Accessory[] = [
  // Hats - Common
  {
    id: "hat_cap",
    name: "Casquette",
    type: "hat",
    price: 10,
    description: "Une casquette décontractée",
    rarity: "common",
    emoji: "🧢",
  },
  {
    id: "hat_beanie",
    name: "Bonnet",
    type: "hat",
    price: 12,
    description: "Un bonnet chaud et confortable",
    rarity: "common",
    emoji: "🎩",
  },
  // Hats - Rare
  {
    id: "hat_party",
    name: "Chapeau de fête",
    type: "hat",
    price: 25,
    description: "Un chapeau coloré pour faire la fête",
    rarity: "rare",
    emoji: "🎉",
  },
  {
    id: "hat_wizard",
    name: "Chapeau de magicien",
    type: "hat",
    price: 30,
    description: "Un chapeau pointu mystique",
    rarity: "rare",
    emoji: "🧙",
  },
  // Hats - Epic
  {
    id: "hat_crown",
    name: "Couronne",
    type: "hat",
    price: 50,
    description: "Une couronne royale dorée",
    rarity: "epic",
    emoji: "👑",
  },
  {
    id: "hat_halo",
    name: "Auréole",
    type: "hat",
    price: 55,
    description: "Une auréole divine brillante",
    rarity: "epic",
    emoji: "😇",
  },
  // Hats - Legendary
  {
    id: "hat_dragon",
    name: "Casque de dragon",
    type: "hat",
    price: 100,
    description: "Un casque légendaire en forme de dragon",
    rarity: "legendary",
    emoji: "🐉",
  },

  // Glasses - Common
  {
    id: "glasses_nerd",
    name: "Lunettes rondes",
    type: "glasses",
    price: 8,
    description: "Des lunettes rondes mignonnes",
    rarity: "common",
    emoji: "🤓",
  },
  {
    id: "glasses_reading",
    name: "Lunettes de lecture",
    type: "glasses",
    price: 10,
    description: "Des lunettes pour lire confortablement",
    rarity: "common",
    emoji: "👓",
  },
  // Glasses - Rare
  {
    id: "glasses_cool",
    name: "Lunettes de soleil",
    type: "glasses",
    price: 22,
    description: "Des lunettes de soleil stylées",
    rarity: "rare",
    emoji: "😎",
  },
  {
    id: "glasses_heart",
    name: "Lunettes coeur",
    type: "glasses",
    price: 28,
    description: "Des lunettes en forme de coeur",
    rarity: "rare",
    emoji: "😍",
  },
  // Glasses - Epic
  {
    id: "glasses_star",
    name: "Lunettes étoiles",
    type: "glasses",
    price: 45,
    description: "Des lunettes en forme d'étoile scintillantes",
    rarity: "epic",
    emoji: "🌟",
  },
  {
    id: "glasses_cyber",
    name: "Lunettes cyber",
    type: "glasses",
    price: 50,
    description: "Des lunettes futuristes high-tech",
    rarity: "epic",
    emoji: "🤖",
  },
  // Glasses - Legendary
  {
    id: "glasses_rainbow",
    name: "Lunettes arc-en-ciel",
    type: "glasses",
    price: 90,
    description: "Des lunettes magiques aux couleurs de l'arc-en-ciel",
    rarity: "legendary",
    emoji: "🌈",
  },

  // Shoes - Common
  {
    id: "shoes_slippers",
    name: "Pantoufles",
    type: "shoes",
    price: 10,
    description: "Des pantoufles douillettes",
    rarity: "common",
    emoji: "🥿",
  },
  {
    id: "shoes_sandals",
    name: "Sandales",
    type: "shoes",
    price: 12,
    description: "Des sandales légères pour l'été",
    rarity: "common",
    emoji: "👡",
  },
  // Shoes - Rare
  {
    id: "shoes_sneakers",
    name: "Baskets",
    type: "shoes",
    price: 25,
    description: "Des baskets confortables et stylées",
    rarity: "rare",
    emoji: "👟",
  },
  {
    id: "shoes_boots",
    name: "Bottes",
    type: "shoes",
    price: 28,
    description: "Des bottes robustes d'aventurier",
    rarity: "rare",
    emoji: "🥾",
  },
  // Shoes - Epic
  {
    id: "shoes_rocket",
    name: "Bottes fusée",
    type: "shoes",
    price: 48,
    description: "Des bottes avec propulseurs intégrés",
    rarity: "epic",
    emoji: "🚀",
  },
  {
    id: "shoes_ice",
    name: "Patins à glace",
    type: "shoes",
    price: 52,
    description: "Des patins magiques qui glissent partout",
    rarity: "epic",
    emoji: "⛸️",
  },
  // Shoes - Legendary
  {
    id: "shoes_wings",
    name: "Bottes ailées",
    type: "shoes",
    price: 95,
    description: "Des bottes légendaires avec des ailes",
    rarity: "legendary",
    emoji: "🦋",
  },
]

export function getRarityColor(rarity: AccessoryRarity): string {
  switch (rarity) {
    case "common":
      return "text-gray-600"
    case "rare":
      return "text-blue-600"
    case "epic":
      return "text-purple-600"
    case "legendary":
      return "text-amber-600"
  }
}

export function getRarityBorderColor(rarity: AccessoryRarity): string {
  switch (rarity) {
    case "common":
      return "border-gray-400"
    case "rare":
      return "border-blue-400"
    case "epic":
      return "border-purple-400"
    case "legendary":
      return "border-amber-400"
  }
}

export function getRarityBackground(rarity: AccessoryRarity): string {
  switch (rarity) {
    case "common":
      return "bg-gray-50"
    case "rare":
      return "bg-blue-50"
    case "epic":
      return "bg-purple-50"
    case "legendary":
      return "bg-gradient-to-br from-amber-50 to-yellow-50"
  }
}

export function getRarityLabel(rarity: AccessoryRarity): string {
  switch (rarity) {
    case "common":
      return "Commun"
    case "rare":
      return "Rare"
    case "epic":
      return "Épique"
    case "legendary":
      return "Légendaire"
  }
}
