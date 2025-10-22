"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PixelMonster, type MonsterTraits } from "@/components/pixel-monster"
import { useSound } from "@/hooks/use-sound"
import { getBackgroundStyle } from "@/lib/backgrounds"

type Monster = {
  id: string
  name: string
  traits: MonsterTraits
  current_state: string
  level?: number
  xp?: number
  like_count: number
  equipped_hat?: string
  equipped_glasses?: string
  equipped_shoes?: string
  current_background?: string
  user_id: string
  created_at: string
}

type GalleryContentProps = {
  monsters: Monster[]
  userDisplayNames: Record<string, string> // Renamed from userEmails
  currentUserId: string
  likedMonsterIds: Set<string>
}

const stateColors = {
  happy: { bg: "bg-green-100 dark:bg-green-900/30", border: "border-green-400", label: "Heureux 😊" },
  sad: { bg: "bg-blue-100 dark:bg-blue-900/30", border: "border-blue-400", label: "Triste 😢" },
  hungry: { bg: "bg-orange-100 dark:bg-orange-900/30", border: "border-orange-400", label: "Affamé 🍎" },
  sleepy: { bg: "bg-purple-100 dark:bg-purple-900/30", border: "border-purple-400", label: "Endormi 😴" },
  sick: { bg: "bg-red-100 dark:bg-red-900/30", border: "border-red-400", label: "Malade 🤒" },
  dirty: { bg: "bg-amber-100 dark:bg-amber-900/30", border: "border-amber-400", label: "Sale 💩" },
  bored: { bg: "bg-gray-100 dark:bg-gray-900/30", border: "border-gray-400", label: "Ennuyé 😐" },
  excited: { bg: "bg-pink-100 dark:bg-pink-900/30", border: "border-pink-400", label: "Excité 🎉" },
}

export function GalleryContent({ monsters, userDisplayNames, currentUserId, likedMonsterIds }: GalleryContentProps) {
  const [likes, setLikes] = useState<Record<string, number>>(
    Object.fromEntries(monsters.map((m) => [m.id, m.like_count])),
  )
  const [likedByUser, setLikedByUser] = useState<Set<string>>(likedMonsterIds)
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({})
  const supabase = createClient()
  const { play } = useSound()

  const handleLike = async (monsterId: string) => {
    if (isLiking[monsterId]) return

    setIsLiking((prev) => ({ ...prev, [monsterId]: true }))

    const isLiked = likedByUser.has(monsterId)

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("monster_likes")
          .delete()
          .eq("user_id", currentUserId)
          .eq("monster_id", monsterId)

        if (error) throw error

        // Update like count
        await supabase.rpc("decrement_like_count", { monster_id: monsterId })

        setLikes((prev) => ({ ...prev, [monsterId]: Math.max(0, prev[monsterId] - 1) }))
        setLikedByUser((prev) => {
          const newSet = new Set(prev)
          newSet.delete(monsterId)
          return newSet
        })
      } else {
        // Like
        const { error } = await supabase.from("monster_likes").insert({
          user_id: currentUserId,
          monster_id: monsterId,
        })

        if (error) throw error

        // Update like count
        await supabase.rpc("increment_like_count", { monster_id: monsterId })

        setLikes((prev) => ({ ...prev, [monsterId]: prev[monsterId] + 1 }))
        setLikedByUser((prev) => new Set(prev).add(monsterId))
        play("coin")
      }
    } catch (error) {
      console.error("[v0] Error toggling like:", error)
      play("error")
    } finally {
      setIsLiking((prev) => ({ ...prev, [monsterId]: false }))
    }
  }

  if (monsters.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Galerie Communautaire
          </h1>
          <p className="text-muted-foreground">Découvrez les monstres des autres joueurs</p>
        </div>
        <Card className="p-12 text-center border-4 border-dashed">
          <Sparkles className="h-16 w-16 mx-auto text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Aucun monstre public pour le moment</h2>
          <p className="text-muted-foreground">Soyez le premier à partager votre monstre avec la communauté !</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Galerie Communautaire
        </h1>
        <p className="text-muted-foreground">Découvrez et likez les monstres des autres joueurs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monsters.map((monster) => {
          const stateStyle = stateColors[monster.current_state as keyof typeof stateColors] || stateColors.happy
          const backgroundStyle = getBackgroundStyle(monster.current_background || "default")
          const isLiked = likedByUser.has(monster.id)
          const isOwner = monster.user_id === currentUserId

          return (
            <Card
              key={monster.id}
              className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-purple-400 bg-card/95 backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div
                  className={`${stateStyle.bg} rounded-2xl p-4 border-2 ${stateStyle.border} transition-colors duration-500 relative overflow-hidden bg-cover bg-center ${backgroundStyle.className || ""}`}
                  style={
                    backgroundStyle.backgroundImage ? { backgroundImage: backgroundStyle.backgroundImage } : undefined
                  }
                >
                  <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                  <div className="w-48 h-48 mx-auto relative z-10">
                    <PixelMonster
                      state={monster.current_state as any}
                      actionAnimation={null}
                      traits={monster.traits}
                      accessories={{
                        hat: monster.equipped_hat,
                        glasses: monster.equipped_glasses,
                        shoes: monster.equipped_shoes,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-1">{monster.name}</h3>
                    <p className="text-sm text-muted-foreground">Par {userDisplayNames[monster.user_id] || "Joueur"}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {monster.level !== undefined && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-2 border-yellow-500 text-sm font-bold px-3 py-1">
                        ⭐ Niv. {monster.level}
                      </Badge>
                    )}
                    <Badge className={`${stateStyle.bg} ${stateStyle.border} border-2 text-sm font-semibold px-3 py-1`}>
                      {stateStyle.label}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => handleLike(monster.id)}
                    disabled={isLiking[monster.id] || isOwner}
                    variant={isLiked ? "default" : "outline"}
                    className={`w-full transition-all duration-300 ${
                      isLiked
                        ? "bg-gradient-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600"
                        : "hover:bg-pink-50 dark:hover:bg-pink-950"
                    } ${isOwner ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    {likes[monster.id] || 0} {isLiked ? "J'aime" : "Liker"}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
