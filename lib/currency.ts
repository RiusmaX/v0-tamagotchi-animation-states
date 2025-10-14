import { createClient } from "@/lib/supabase/client"

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
    return true
  }

  const { error } = await supabase
    .from("user_profiles")
    .update({ coins: profile.coins + amount })
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error adding coins:", error)
    return false
  }

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

  const { error } = await supabase
    .from("user_profiles")
    .update({ coins: profile.coins - amount })
    .eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error spending coins:", error)
    return false
  }

  return true
}

export type AccessoryType = "hat" | "glasses" | "shoes"

export interface Accessory {
  id: string
  name: string
  type: AccessoryType
  price: number
  description: string
}

export const ACCESSORIES: Accessory[] = [
  {
    id: "hat_party",
    name: "Chapeau de fête",
    type: "hat",
    price: 15,
    description: "Un chapeau coloré pour faire la fête",
  },
  { id: "hat_crown", name: "Couronne", type: "hat", price: 25, description: "Une couronne royale dorée" },
  { id: "hat_cap", name: "Casquette", type: "hat", price: 10, description: "Une casquette décontractée" },
  {
    id: "glasses_cool",
    name: "Lunettes de soleil",
    type: "glasses",
    price: 12,
    description: "Des lunettes de soleil stylées",
  },
  {
    id: "glasses_nerd",
    name: "Lunettes rondes",
    type: "glasses",
    price: 8,
    description: "Des lunettes rondes mignonnes",
  },
  {
    id: "glasses_star",
    name: "Lunettes étoiles",
    type: "glasses",
    price: 18,
    description: "Des lunettes en forme d'étoile",
  },
  { id: "shoes_sneakers", name: "Baskets", type: "shoes", price: 20, description: "Des baskets confortables" },
  { id: "shoes_boots", name: "Bottes", type: "shoes", price: 22, description: "Des bottes robustes" },
  { id: "shoes_slippers", name: "Pantoufles", type: "shoes", price: 10, description: "Des pantoufles douillettes" },
]
