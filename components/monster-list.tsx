"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { PixelMonster, type MonsterTraits } from "@/components/pixel-monster"

type Monster = {
  id: string
  name: string
  traits: MonsterTraits
  current_state: string
  created_at: string
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

const monsterNames = [
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

export function MonsterList({ monsters, userId }: MonsterListProps) {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateMonster = async () => {
    setIsCreating(true)

    const traits = generateRandomTraits()
    const randomName = monsterNames[Math.floor(Math.random() * monsterNames.length)]

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
      router.refresh()
    } catch (error) {
      console.error("[v0] Error creating monster:", error)
      setIsCreating(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button
          onClick={handleCreateMonster}
          disabled={isCreating}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          {isCreating ? "Création..." : "Créer un nouveau monstre"}
        </Button>

        <Button onClick={handleLogout} variant="outline" size="lg">
          Se déconnecter
        </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monsters.map((monster) => (
            <Link key={monster.id} href={`/monster/${monster.id}`}>
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-4 border-border bg-card/95 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-blue-100/50 rounded-2xl p-4 border-2 border-border">
                    <div className="w-48 h-48 mx-auto">
                      <PixelMonster
                        state={monster.current_state as any}
                        actionAnimation={null}
                        traits={monster.traits}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-1">{monster.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      État :{" "}
                      {monster.current_state === "happy"
                        ? "Heureux"
                        : monster.current_state === "sad"
                          ? "Triste"
                          : monster.current_state === "hungry"
                            ? "Affamé"
                            : monster.current_state === "sleepy"
                              ? "Endormi"
                              : monster.current_state === "sick"
                                ? "Malade"
                                : monster.current_state === "dirty"
                                  ? "Sale"
                                  : monster.current_state === "bored"
                                    ? "Ennuyé"
                                    : monster.current_state === "excited"
                                      ? "Excité"
                                      : monster.current_state}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
