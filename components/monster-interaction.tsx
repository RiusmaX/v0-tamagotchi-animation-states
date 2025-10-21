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
import { WalletDisplay } from "@/components/wallet-display"
import { ShopModal } from "@/components/shop-modal"
import { CoinAnimation } from "@/components/coin-animation"
import { useSound } from "@/hooks/use-sound"
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [newName, setNewName] = useState(initialMonster.name)
  const [isRenaming, setIsRenaming] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { play } = useSound()

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

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
      }
    }, 1000) // Debounce by 1 second

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state, monster.id, supabase])

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

  const handleAction = useCallback(
    async (action: "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift") => {
      play("action", 0.3)
      setIsAnimating(true)
      setCurrentAction(action)

      await addCoins(1)
      play("coin", 0.4)
      setCoinTrigger((prev) => prev + 1)

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
    },
    [state, play],
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
      router.refresh()
    } catch (error) {
      console.error("[v0] Error renaming monster:", error)
    } finally {
      setIsRenaming(false)
    }
  }

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
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="sm:size-default bg-transparent">
                <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <WalletDisplay />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="sm:size-default bg-transparent">
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
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setShopOpen(true)}
              className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg"
              size="lg"
            >
              <ShoppingBag className="h-5 w-5" />
              Boutique
            </Button>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2 sm:mb-3 font-sans">
            {monster.name}
          </h1>
          <p className="text-muted-foreground text-base sm:text-xl font-medium">
            Prends soin de ton petit monstre adorable !
          </p>
        </div>

        <div className="mb-6 bg-gradient-to-br from-pink-100/50 via-purple-100/50 to-blue-100/50 rounded-3xl p-4 sm:p-6 md:p-8 border-4 border-border shadow-inner sm:mb-0">
          <div className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto">
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

        <div className="mb-6 sm:mb-8">
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

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
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
    </main>
  )
}
