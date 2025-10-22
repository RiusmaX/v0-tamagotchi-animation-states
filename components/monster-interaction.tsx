"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { PixelMonster, type MonsterTraits } from "@/components/pixel-monster"
import { ActionButtons } from "@/components/action-buttons"
import { StatusDisplay } from "@/components/status-display"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag, Trash2, MoreVertical, Edit } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { calculateMonsterState, getRandomStateChangeInterval, type MonsterState } from "@/lib/monster-state"
import { addCoins } from "@/lib/currency"
import { ShopModal } from "@/components/shop-modal"
import { CoinAnimation } from "@/components/coin-animation"
import { useSound } from "@/hooks/use-sound"
import { emitMonsterUpdate, emitMonsterDeleted, emitMonsterRenamed } from "@/lib/monster-events"
import { LevelDisplay } from "@/components/level-display"
import { XPAnimation } from "@/components/xp-animation"
import { LevelUpModal } from "@/components/level-up-modal"
import { XP_PER_ACTION, addXP, calculateLevelFromXP } from "@/lib/xp-system"
import { getBackgroundStyle } from "@/lib/backgrounds"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { updateQuestProgress } from "@/lib/daily-quests"

type ActionAnimation = "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift" | null

type Monster = {
  id: string
  name: string
  traits: MonsterTraits
  current_state: string
  user_id: string
  last_state_change?: string
  equipped_hat?: string | null
  equipped_glasses?: string | null
  equipped_shoes?: string | null
  level?: number
  xp?: number
  total_xp?: number
  current_background?: string
  owned_backgrounds?: string[]
}

export function MonsterInteraction({ monster: initialMonster }: { monster: Monster }) {
  const initialState = calculateMonsterState(
    initialMonster.last_state_change,
    initialMonster.current_state as MonsterState,
  )

  const [state, setState] = useState<MonsterState>(initialState)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentAction, setCurrentAction] = useState<ActionAnimation>(null)
  const [shopOpen, setShopOpen] = useState(false)
  const [monster, setMonster] = useState(initialMonster)
  const [coinTrigger, setCoinTrigger] = useState(0)
  const [xpTrigger, setXpTrigger] = useState(0)
  const [lastXPGained, setLastXPGained] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [newLevel, setNewLevel] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newName, setNewName] = useState(initialMonster.name)
  const [isRenaming, setIsRenaming] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { play } = useSound()

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const levelInfo = calculateLevelFromXP(monster.total_xp || 0)

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    if (!isAnimating) {
      saveTimeoutRef.current = setTimeout(async () => {
        const { error } = await supabase
          .from("monsters")
          .update({
            current_state: state,
            last_state_change: new Date().toISOString(),
          })
          .eq("id", monster.id)

        if (error) {
          console.error("[v0] Error saving monster state:", error)
        } else {
          emitMonsterUpdate(monster.id, state)
        }
      }, 1000)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state, monster.id, supabase, isAnimating])

  useEffect(() => {
    const scheduleNextStateChange = () => {
      const interval = getRandomStateChangeInterval()

      const timeout = setTimeout(() => {
        if (state === "happy" && !isAnimating) {
          const randomStates: MonsterState[] = ["sad", "hungry", "sleepy", "sick", "dirty", "bored"]
          const randomState = randomStates[Math.floor(Math.random() * randomStates.length)]
          setState(randomState)
        }
        scheduleNextStateChange()
      }, interval)

      return timeout
    }

    const timeout = scheduleNextStateChange()
    return () => clearTimeout(timeout)
  }, [state, isAnimating])

  const saveStateImmediately = useCallback(
    async (newState: MonsterState) => {
      const { error } = await supabase
        .from("monsters")
        .update({
          current_state: newState,
          last_state_change: new Date().toISOString(),
        })
        .eq("id", monster.id)

      if (error) {
        console.error("[v0] Error saving monster state:", error)
      } else {
        emitMonsterUpdate(monster.id, newState)
      }
    },
    [monster.id, supabase],
  )

  const handleAction = useCallback(
    async (action: "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift") => {
      play("action", 0.3)
      setIsAnimating(true)
      setCurrentAction(action)

      await addCoins(1)
      play("coin", 0.4)
      setCoinTrigger((prev) => prev + 1)

      const xpGained = XP_PER_ACTION[action]
      const xpResult = addXP(monster.total_xp || 0, xpGained)

      setLastXPGained(xpGained)
      setXpTrigger((prev) => prev + 1)

      const updatedMonster = {
        ...monster,
        level: xpResult.newLevel,
        xp: xpResult.newCurrentXP,
        total_xp: xpResult.newTotalXP,
      }
      setMonster(updatedMonster)

      if (xpResult.leveledUp) {
        setNewLevel(xpResult.newLevel)
        setShowLevelUp(true)
        play("success", 0.5)

        // Award 5 coins for leveling up
        await addCoins(5)
        play("coin", 0.4)
        setCoinTrigger((prev) => prev + 1)
      }

      if (action === "feed") {
        await updateQuestProgress("feed")
      } else if (action === "play") {
        await updateQuestProgress("play")
      } else if (action === "gift") {
        await updateQuestProgress("gift")
      }

      const actionStateMap = {
        play: "bored",
        feed: "hungry",
        sleep: "sleepy",
        wash: "dirty",
        heal: "sick",
        hug: "sad",
        gift: "bored",
      }

      let newState: MonsterState = state

      if (state === actionStateMap[action]) {
        newState = "happy"
      } else if (action === "gift" && state === "happy") {
        newState = "excited"
      }

      if (newState !== state) {
        setState(newState)
        await supabase
          .from("monsters")
          .update({
            current_state: newState,
            last_state_change: new Date().toISOString(),
            level: xpResult.newLevel,
            xp: xpResult.newCurrentXP,
            total_xp: xpResult.newTotalXP,
          })
          .eq("id", monster.id)
        emitMonsterUpdate(monster.id, newState)
      } else {
        await supabase
          .from("monsters")
          .update({
            level: xpResult.newLevel,
            xp: xpResult.newCurrentXP,
            total_xp: xpResult.newTotalXP,
          })
          .eq("id", monster.id)
      }

      setTimeout(() => {
        setIsAnimating(false)
        setCurrentAction(null)

        if (action === "gift" && newState === "excited") {
          setTimeout(() => {
            setState("happy")
            saveStateImmediately("happy")
          }, 3000)
        }
      }, 1500)
    },
    [state, play, monster, supabase, saveStateImmediately],
  )

  const handleAccessoryEquipped = useCallback(async () => {
    const { data, error } = await supabase.from("monsters").select("*").eq("id", monster.id).single()

    if (!error && data) {
      setMonster(data)
    }
  }, [monster.id, supabase])

  const handleDeleteMonster = async () => {
    setIsDeleting(true)

    try {
      const { error } = await supabase.from("monsters").delete().eq("id", monster.id).eq("user_id", monster.user_id)

      if (error) throw error

      emitMonsterDeleted(monster.id)
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting monster:", error)
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const handleRenameMonster = async () => {
    if (!newName.trim() || newName === monster.name) {
      setRenameDialogOpen(false)
      return
    }

    setIsRenaming(true)

    try {
      const { error } = await supabase
        .from("monsters")
        .update({ name: newName.trim() })
        .eq("id", monster.id)
        .eq("user_id", monster.user_id)

      if (error) throw error

      setMonster({ ...monster, name: newName.trim() })
      setRenameDialogOpen(false)
      emitMonsterRenamed(monster.id, newName.trim())
      router.refresh()
    } catch (error) {
      console.error("[v0] Error renaming monster:", error)
    } finally {
      setIsRenaming(false)
    }
  }

  const backgroundStyle = getBackgroundStyle(monster.current_background || "default")

  return (
    <main className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
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

      <Card className="w-full max-w-2xl p-4 sm:p-6 md:p-8 shadow-2xl border-4 border-border bg-card/95 backdrop-blur-sm relative z-10">
        <CoinAnimation trigger={coinTrigger} />
        <XPAnimation trigger={xpTrigger} xpGained={lastXPGained} />

        <div className="flex items-center justify-between gap-2 mb-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="bg-transparent">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>

          <Button
            onClick={() => setShopOpen(true)}
            className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Boutique</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Renommer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2 font-sans">
            {monster.name}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium">
            Prends soin de ton petit monstre adorable !
          </p>
        </div>

        <div className="mb-4">
          <LevelDisplay
            level={levelInfo.level}
            currentXP={levelInfo.currentXP}
            xpForNextLevel={levelInfo.xpForNextLevel}
          />
        </div>

        <div
          className={`mb-4 rounded-3xl p-3 sm:p-4 md:p-6 border-4 border-border shadow-inner bg-cover bg-center relative overflow-hidden ${backgroundStyle.className || ""}`}
          style={backgroundStyle.backgroundImage ? { backgroundImage: backgroundStyle.backgroundImage } : undefined}
        >
          <div className="absolute inset-0 bg-black/20 rounded-3xl" />
          <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto relative z-10">
            <PixelMonster
              state={state}
              actionAnimation={currentAction}
              traits={monster.traits}
              accessories={{
                hat: monster.equipped_hat || undefined,
                glasses: monster.equipped_glasses || undefined,
                shoes: monster.equipped_shoes || undefined,
              }}
            />
          </div>
        </div>

        <div className="mb-4">
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

        <div className="mt-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p className="font-medium">✨ Astuce : Chaque action te rapporte 1 coin !</p>
        </div>
      </Card>

      <ShopModal
        open={shopOpen}
        onOpenChange={setShopOpen}
        monsterId={monster.id}
        onAccessoryEquipped={handleAccessoryEquipped}
      />

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer {monster.name}</DialogTitle>
            <DialogDescription>
              Choisissez un nouveau nom pour votre monstre. Le nom doit contenir au moins 1 caractère.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nouveau nom</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom du monstre"
                maxLength={50}
                disabled={isRenaming}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)} disabled={isRenaming}>
              Annuler
            </Button>
            <Button onClick={handleRenameMonster} disabled={isRenaming || !newName.trim()}>
              {isRenaming ? "Renommage..." : "Renommer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {monster.name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce monstre ? Cette action est irréversible et toutes les données
              associées seront perdues définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMonster}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LevelUpModal show={showLevelUp} newLevel={newLevel} onClose={() => setShowLevelUp(false)} />
    </main>
  )
}
