"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { PixelMonster, type MonsterTraits } from "@/components/pixel-monster"
import { calculateMonsterState, type MonsterState } from "@/lib/monster-state"
import { WalletDisplay } from "@/components/wallet-display"
import { monsterEvents } from "@/lib/monster-events"

type Monster = {
  id: string
  name: string
  traits: MonsterTraits
  current_state: string
  created_at: string
  last_state_change?: string
  equipped_hat?: string
  equipped_glasses?: string
  equipped_shoes?: string
  level?: number // Added level field
  xp?: number // Added xp field
}

type MonsterListProps = {
  monsters: Monster[]
  userId: string
}

function generateRandomTraits(): MonsterTraits {
  const pastelColors = [
    ["#FFB5E8", "#FF9CEE"],
    ["#B5E8FF", "#9CD8FF"],
    ["#E8FFB5", "#D8FF9C"],
    ["#FFE8B5", "#FFD89C"],
    ["#E8B5FF", "#D89CFF"],
    ["#FFB5C5", "#FF9CB5"],
    ["#B5FFE8", "#9CFFD8"],
    ["#FFC5B5", "#FFB59C"],
  ]

  const antennaColors = ["#FFE66D", "#FF6B9D", "#6BDBFF", "#B4FF6B", "#FF9CEE", "#FFB347"]
  const eyeColors = ["#2C2C2C", "#4A4A4A", "#1A1A1A", "#3D3D3D"]

  const bodyStyles: Array<"round" | "square" | "tall" | "wide"> = ["round", "square", "tall", "wide"]
  const eyeStyles: Array<"big" | "small" | "star" | "sleepy"> = ["big", "small", "star", "sleepy"]
  const antennaStyles: Array<"single" | "double" | "curly" | "none"> = ["single", "double", "curly", "none"]
  const accessories: Array<"horns" | "ears" | "tail" | "none"> = ["horns", "ears", "tail", "none"]

  const randomPalette = pastelColors[Math.floor(Math.random() * pastelColors.length)]
  const randomAntenna = antennaColors[Math.floor(Math.random() * antennaColors.length)]
  const randomEye = eyeColors[Math.floor(Math.random() * eyeColors.length)]

  return {
    bodyColor: randomPalette[0],
    accentColor: randomPalette[1],
    eyeColor: randomEye,
    antennaColor: randomAntenna,
    bobbleColor: randomAntenna,
    cheekColor: adjustColorOpacity(randomPalette[0], 0.7),
    bodyStyle: bodyStyles[Math.floor(Math.random() * bodyStyles.length)],
    eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
    antennaStyle: antennaStyles[Math.floor(Math.random() * antennaStyles.length)],
    accessory: accessories[Math.floor(Math.random() * accessories.length)],
  }
}

function adjustColorOpacity(hex: string, opacity: number): string {
  const num = Number.parseInt(hex.replace("#", ""), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const monsterNamesList = [
  "Bubbles",
  "Pixel",
  "Mochi",
  "Kiwi",
  "Peach",
  "Luna",
  "Star",
  "Cloud",
  "Berry",
  "Candy",
  "Honey",
  "Maple",
  "Sunny",
  "Daisy",
  "Rosie",
  "Lily",
]

const stateColors = {
  happy: {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-400",
    text: "text-green-700 dark:text-green-300",
    label: "Heureux 😊",
  },
  sad: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-400",
    text: "text-blue-700 dark:text-blue-300",
    label: "Triste 😢",
  },
  hungry: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    border: "border-orange-400",
    text: "text-orange-700 dark:text-orange-300",
    label: "Affamé 🍎",
  },
  sleepy: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-400",
    text: "text-purple-700 dark:text-purple-300",
    label: "Endormi 😴",
  },
  sick: {
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-400",
    text: "text-red-700 dark:text-red-300",
    label: "Malade 🤒",
  },
  dirty: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-400",
    text: "text-amber-700 dark:text-amber-300",
    label: "Sale 💩",
  },
  bored: {
    bg: "bg-gray-100 dark:bg-gray-900/30",
    border: "border-gray-400",
    text: "text-gray-700 dark:text-gray-300",
    label: "Ennuyé 😐",
  },
  excited: {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    border: "border-pink-400",
    text: "text-pink-700 dark:text-pink-300",
    label: "Excité 🎉",
  },
}

const MonsterCard = memo(({ monster, displayState }: { monster: Monster; displayState: string }) => {
  const stateStyle = stateColors[displayState as keyof typeof stateColors] || stateColors.happy

  return (
    <Link key={monster.id} href={`/monster/${monster.id}`}>
      <Card
        className={`p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-4 ${stateStyle.border} bg-card/95 backdrop-blur-sm`}
      >
        <div className="space-y-4">
          <div
            className={`${stateStyle.bg} rounded-2xl p-4 border-2 ${stateStyle.border} transition-colors duration-500`}
          >
            <div className="w-48 h-48 mx-auto">
              <PixelMonster
                state={displayState as any}
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
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-foreground mb-1">{monster.name}</h3>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {monster.level !== undefined && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-2 border-yellow-500 text-sm font-bold px-3 py-1">
                  ⭐ Niv. {monster.level}
                </Badge>
              )}
              <Badge
                className={`${stateStyle.bg} ${stateStyle.text} ${stateStyle.border} border-2 text-sm font-semibold px-3 py-1`}
              >
                {stateStyle.label}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
})

MonsterCard.displayName = "MonsterCard"

export function MonsterList({ monsters, userId }: MonsterListProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [displayStates, setDisplayStates] = useState<Record<string, string>>({})
  const [monsterNames, setMonsterNames] = useState<Record<string, string>>({})
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initialStates: Record<string, string> = {}
    const initialNames: Record<string, string> = {}
    monsters.forEach((monster) => {
      initialStates[monster.id] = calculateMonsterState(
        monster.last_state_change,
        monster.current_state as MonsterState,
      )
      initialNames[monster.id] = monster.name
    })
    setDisplayStates(initialStates)
    setMonsterNames(initialNames)
  }, [monsters])

  useEffect(() => {
    const handleMonsterUpdate = (data: { monsterId: string; state: string }) => {
      setDisplayStates((prev) => ({
        ...prev,
        [data.monsterId]: data.state,
      }))
    }

    const handleMonsterRenamed = (data: { monsterId: string; name: string }) => {
      setMonsterNames((prev) => ({
        ...prev,
        [data.monsterId]: data.name,
      }))
    }

    const handleMonsterDeleted = () => {
      // Refresh the page to update the list
      router.refresh()
    }

    monsterEvents.on("monster-update", handleMonsterUpdate)
    monsterEvents.on("monster-renamed", handleMonsterRenamed)
    monsterEvents.on("monster-deleted", handleMonsterDeleted)

    return () => {
      monsterEvents.off("monster-update", handleMonsterUpdate)
      monsterEvents.off("monster-renamed", handleMonsterRenamed)
      monsterEvents.off("monster-deleted", handleMonsterDeleted)
    }
  }, [router])

  useEffect(() => {
    const interval = setInterval(async () => {
      const newStates: Record<string, string> = {}
      const updates: Array<{ id: string; state: string }> = []

      monsters.forEach((monster) => {
        const newState = calculateMonsterState(monster.last_state_change, monster.current_state as MonsterState)
        newStates[monster.id] = newState

        if (newState !== monster.current_state) {
          updates.push({ id: monster.id, state: newState })
        }
      })

      setDisplayStates(newStates)

      if (updates.length > 0) {
        for (const update of updates) {
          await supabase
            .from("monsters")
            .update({
              current_state: update.state,
              last_state_change: new Date().toISOString(),
            })
            .eq("id", update.id)
        }
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [monsters, supabase])

  const handleCreateMonster = useCallback(async () => {
    setIsCreating(true)

    const traits = generateRandomTraits()
    const randomName = monsterNamesList[Math.floor(Math.random() * monsterNamesList.length)]

    try {
      const { data, error } = await supabase
        .from("monsters")
        .insert({
          user_id: userId,
          name: randomName,
          traits: traits,
          current_state: "happy",
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/monster/${data.id}`)
    } catch (error) {
      console.error("[v0] Error creating monster:", error)
      setIsCreating(false)
    }
  }, [userId, supabase, router])

  const monsterCards = useMemo(() => {
    return monsters.map((monster) => {
      const displayState = displayStates[monster.id] || monster.current_state
      const displayName = monsterNames[monster.id] || monster.name
      return <MonsterCard key={monster.id} monster={{ ...monster, name: displayName }} displayState={displayState} />
    })
  }, [monsters, displayStates, monsterNames])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <Button
          onClick={handleCreateMonster}
          disabled={isCreating}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          {isCreating ? "Création..." : "Créer un nouveau monstre"}
        </Button>

        <WalletDisplay />
      </div>

      {monsters.length === 0 ? (
        <Card className="p-12 text-center border-4 border-dashed">
          <div className="space-y-4">
            <Sparkles className="h-16 w-16 mx-auto text-purple-400" />
            <h2 className="text-2xl font-bold text-muted-foreground">Aucun monstre pour le moment</h2>
            <p className="text-muted-foreground">Créez votre premier Tamagotchi pour commencer l&apos;aventure !</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{monsterCards}</div>
      )}
    </div>
  )
}
