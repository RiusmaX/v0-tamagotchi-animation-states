import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GalleryContent } from "./gallery-content"

export const dynamic = "force-dynamic"

export default async function GalleryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: publicMonsters, error } = await supabase
    .from("monsters")
    .select(
      `
      id,
      name,
      traits,
      current_state,
      level,
      xp,
      like_count,
      equipped_hat,
      equipped_glasses,
      equipped_shoes,
      current_background,
      user_id,
      created_at
    `,
    )
    .eq("is_public", true)
    .order("like_count", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[v0] Error fetching public monsters:", error)
    return <div>Error loading gallery</div>
  }

  const userIds = [...new Set(publicMonsters?.map((m) => m.user_id) || [])]
  const userDisplayNames: Record<string, string> = {}

  // Fetch display names for each user
  for (const userId of userIds) {
    const { data, error } = await supabase.rpc("get_user_display_name", { user_uuid: userId })
    if (!error && data) {
      userDisplayNames[userId] = data
    } else {
      userDisplayNames[userId] = "Joueur"
    }
  }

  // Fetch user's likes
  const { data: userLikes } = await supabase.from("monster_likes").select("monster_id").eq("user_id", user.id)

  const likedMonsterIds = new Set(userLikes?.map((like) => like.monster_id) || [])

  return (
    <GalleryContent
      monsters={publicMonsters || []}
      userDisplayNames={userDisplayNames}
      currentUserId={user.id}
      likedMonsterIds={likedMonsterIds}
    />
  )
}
