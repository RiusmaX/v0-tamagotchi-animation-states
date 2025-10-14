"use client"

import { useState, useEffect } from "react"
import { PixelMonster, type MonsterTraits } from "@/components/pixel-monster"
import { ActionButtons } from "@/components/action-buttons"
import { StatusDisplay } from "@/components/status-display"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

type MonsterState = "happy" | "sad" | "hungry" | "sleepy" | "sick" | "dirty" | "bored" | "excited"
type ActionAnimation = "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift" | null

function generateRandomTraits(): MonsterTraits {
  const pastelColors = [
    ["#FFB5E8", "#FF9CEE"], // Pink
    ["#B5E8FF", "#9CD8FF"], // Blue
    ["#E8FFB5", "#D8FF9C"], // Green
    ["#FFE8B5", "#FFD89C"], // Yellow
    ["#E8B5FF", "#D89CFF"], // Purple
    ["#FFB5C5", "#FF9CB5"], // Rose
    ["#B5FFE8", "#9CFFD8"], // Mint
    ["#FFC5B5", "#FFB59C"], // Peach
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

export default function TamagotchiPage() {
  const [state, setState] = useState<MonsterState>("happy")
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentAction, setCurrentAction] = useState<ActionAnimation>(null)
  const [traits, setTraits] = useState<MonsterTraits>(generateRandomTraits())
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (state === "happy" && !isAnimating) {
        const randomStates: MonsterState[] = ["sad", "hungry", "sleepy", "sick", "dirty", "bored"]
        const randomState = randomStates[Math.floor(Math.random() * randomStates.length)]
        setState(randomState)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [state, isAnimating])

  const handleAction = (action: "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift") => {
    setIsAnimating(true)
    setCurrentAction(action)

    const actionStateMap = {
      play: "bored",
      feed: "hungry",
      sleep: "sleepy",
      wash: "dirty",
      heal: "sick",
      hug: "sad",
      gift: "bored",
    }

    if (state === actionStateMap[action]) {
      setTimeout(() => {
        setState("happy")
        setIsAnimating(false)
        setCurrentAction(null)
      }, 1500)
    } else if (action === "gift" && state === "happy") {
      // Gift makes happy monster excited
      setTimeout(() => {
        setState("excited")
        setIsAnimating(false)
        setCurrentAction(null)

        // Return to happy after being excited
        setTimeout(() => {
          setState("happy")
        }, 3000)
      }, 1500)
    } else {
      setTimeout(() => {
        setIsAnimating(false)
        setCurrentAction(null)
      }, 1500)
    }
  }

  const handleGenerateNewMonster = () => {
    setIsRegenerating(true)
    setTimeout(() => {
      setTraits(generateRandomTraits())
      setState("happy")
      setIsRegenerating(false)
    }, 300)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 bg-pink-200 rounded-full opacity-20 float-animation" />
        <div
          className="absolute top-40 right-32 w-12 h-12 bg-purple-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-40 w-20 h-20 bg-blue-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-14 h-14 bg-yellow-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <Card className="w-full max-w-2xl p-8 shadow-2xl border-4 border-border bg-card/95 backdrop-blur-sm relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3 font-sans">
            Mon Tamagotchi
          </h1>
          <p className="text-muted-foreground text-xl font-medium">Prends soin de ton petit monstre adorable !</p>
        </div>

        <div className="mb-8 bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-blue-100/50 rounded-3xl p-8 border-4 border-border shadow-inner">
          <div className="w-80 h-80 mx-auto">
            <PixelMonster state={state} actionAnimation={currentAction} traits={traits} />
          </div>
        </div>

        <div className="mb-8">
          <StatusDisplay state={state} />
        </div>

        <ActionButtons
          onPlay={() => handleAction("play")}
          onFeed={() => handleAction("feed")}
          onSleep={() => handleAction("sleep")}
          onWash={() => handleAction("wash")}
          onHeal={() => handleAction("heal")}
          onHug={() => handleAction("hug")}
          onGift={() => handleAction("gift")}
          disabled={isAnimating}
        />

        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleGenerateNewMonster}
            disabled={isRegenerating}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {isRegenerating ? "Génération..." : "Nouveau Monstre"}
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="font-medium">✨ Astuce : Utilise la bonne action selon l&apos;état de ton monstre !</p>
        </div>
      </Card>
    </main>
  )
}
