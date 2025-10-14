"use client"

import { useState, useEffect } from "react"
import { PixelMonster, type MonsterTraits } from "@/components/pixel-monster"
import { ActionButtons } from "@/components/action-buttons"
import { StatusDisplay } from "@/components/status-display"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type MonsterState = "happy" | "sad" | "hungry" | "sleepy" | "sick" | "dirty" | "bored" | "excited"
type ActionAnimation = "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift" | null

type Monster = {
  id: string
  name: string
  traits: MonsterTraits
  current_state: string
  user_id: string
}

export function MonsterInteraction({ monster }: { monster: Monster }) {
  const [state, setState] = useState<MonsterState>(monster.current_state as MonsterState)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentAction, setCurrentAction] = useState<ActionAnimation>(null)
  const supabase = createClient()

  useEffect(() => {
    const saveState = async () => {
      const { error } = await supabase.from("monsters").update({ current_state: state }).eq("id", monster.id)

      if (error) {
        console.error("[v0] Error saving monster state:", error)
      }
    }

    saveState()
  }, [state, monster.id, supabase])

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
      setTimeout(() => {
        setState("excited")
        setIsAnimating(false)
        setCurrentAction(null)

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
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3 font-sans">
            {monster.name}
          </h1>
          <p className="text-muted-foreground text-xl font-medium">Prends soin de ton petit monstre adorable !</p>
        </div>

        <div className="mb-8 bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-blue-100/50 rounded-3xl p-8 border-4 border-border shadow-inner">
          <div className="w-80 h-80 mx-auto">
            <PixelMonster state={state} actionAnimation={currentAction} traits={monster.traits} />
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

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="font-medium">✨ Astuce : Utilise la bonne action selon l&apos;état de ton monstre !</p>
        </div>
      </Card>
    </main>
  )
}
