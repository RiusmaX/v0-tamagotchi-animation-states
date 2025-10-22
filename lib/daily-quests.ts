import { createClient } from "@/lib/supabase/client"

export type QuestType = "feed" | "play" | "gift" | "level_up" | "login_streak"

export type RewardType = "coins" | "accessory"

export interface Quest {
  id: string
  user_id: string
  quest_type: QuestType
  target_count: number
  current_count: number
  reward_type: RewardType
  reward_amount: number
  completed: boolean
  claimed: boolean
  quest_date: string
  created_at: string
  updated_at: string
}

export interface QuestDefinition {
  type: QuestType
  title: string
  description: string
  icon: string
  targetCount: number
  rewardType: RewardType
  rewardAmount: number
  rewardDescription: string
}

// Quest definitions
export const QUEST_DEFINITIONS: QuestDefinition[] = [
  {
    type: "feed",
    title: "Nourrir 3 fois",
    description: "Nourris ton monstre 3 fois aujourd'hui",
    icon: "🍖",
    targetCount: 3,
    rewardType: "coins",
    rewardAmount: 10,
    rewardDescription: "10 pièces",
  },
  {
    type: "play",
    title: "Jouer 5 fois",
    description: "Joue avec ton monstre 5 fois aujourd'hui",
    icon: "🎮",
    targetCount: 5,
    rewardType: "coins",
    rewardAmount: 15,
    rewardDescription: "15 pièces",
  },
  {
    type: "gift",
    title: "Offrir 2 cadeaux",
    description: "Offre 2 cadeaux à ton monstre aujourd'hui",
    icon: "🎁",
    targetCount: 2,
    rewardType: "coins",
    rewardAmount: 20,
    rewardDescription: "20 pièces",
  },
]

// Generate daily quests for a user
export async function generateDailyQuests(userId: string): Promise<Quest[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split("T")[0]

  // Check if quests already exist for today
  const { data: existingQuests } = await supabase
    .from("daily_quests")
    .select("*")
    .eq("user_id", userId)
    .eq("quest_date", today)

  if (existingQuests && existingQuests.length > 0) {
    return existingQuests
  }

  // Generate new quests
  const questsToInsert = QUEST_DEFINITIONS.map((def) => ({
    user_id: userId,
    quest_type: def.type,
    target_count: def.targetCount,
    current_count: 0,
    reward_type: def.rewardType,
    reward_amount: def.rewardAmount,
    completed: false,
    claimed: false,
    quest_date: today,
  }))

  const { data: newQuests, error } = await supabase.from("daily_quests").insert(questsToInsert).select()

  if (error) {
    console.error("[v0] Error generating daily quests:", error)
    return []
  }

  return newQuests || []
}

// Get user's daily quests
export async function getDailyQuests(): Promise<Quest[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const today = new Date().toISOString().split("T")[0]

  // Try to get existing quests
  let { data: quests } = await supabase
    .from("daily_quests")
    .select("*")
    .eq("user_id", user.id)
    .eq("quest_date", today)
    .order("created_at", { ascending: true })

  // If no quests exist, generate them
  if (!quests || quests.length === 0) {
    quests = await generateDailyQuests(user.id)
  }

  return quests || []
}

// Update quest progress
export async function updateQuestProgress(questType: QuestType, increment = 1): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const today = new Date().toISOString().split("T")[0]

  // Get the quest
  const { data: quest } = await supabase
    .from("daily_quests")
    .select("*")
    .eq("user_id", user.id)
    .eq("quest_type", questType)
    .eq("quest_date", today)
    .single()

  if (!quest || quest.completed) return

  const newCount = quest.current_count + increment
  const completed = newCount >= quest.target_count

  await supabase
    .from("daily_quests")
    .update({
      current_count: newCount,
      completed: completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", quest.id)
}

// Claim quest reward
export async function claimQuestReward(questId: string): Promise<boolean> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  // Get the quest
  const { data: quest } = await supabase.from("daily_quests").select("*").eq("id", questId).single()

  if (!quest || !quest.completed || quest.claimed) {
    return false
  }

  // Mark as claimed
  const { error: updateError } = await supabase
    .from("daily_quests")
    .update({
      claimed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", questId)

  if (updateError) {
    console.error("[v0] Error claiming quest:", updateError)
    return false
  }

  // Give reward
  if (quest.reward_type === "coins") {
    const { data: profile } = await supabase.from("user_profiles").select("coins").eq("user_id", user.id).single()

    if (profile) {
      await supabase
        .from("user_profiles")
        .update({ coins: profile.coins + quest.reward_amount })
        .eq("user_id", user.id)
    }
  }

  return true
}

// Get quest definition by type
export function getQuestDefinition(type: QuestType): QuestDefinition | undefined {
  return QUEST_DEFINITIONS.find((def) => def.type === type)
}
