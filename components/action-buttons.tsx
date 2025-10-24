"use client"

import { Button } from "@/components/ui/button"
import { Heart, Utensils, Moon, Sparkles, Pill, Droplets, Gift } from "lucide-react"
import { getAnimationByAction } from "@/lib/animation-unlocks"
import { Badge } from "@/components/ui/badge"

interface ActionButtonsProps {
  onPlay: () => void
  onFeed: () => void
  onSleep: () => void
  onWash: () => void
  onHeal: () => void
  onHug: () => void
  onGift: () => void
  disabled?: boolean
  level?: number
}

export function ActionButtons({
  onPlay,
  onFeed,
  onSleep,
  onWash,
  onHeal,
  onHug,
  onGift,
  disabled,
  level = 1,
}: ActionButtonsProps) {
  const playAnimation = getAnimationByAction("play", level)
  const feedAnimation = getAnimationByAction("feed", level)
  const sleepAnimation = getAnimationByAction("sleep", level)
  const washAnimation = getAnimationByAction("wash", level)
  const healAnimation = getAnimationByAction("heal", level)
  const hugAnimation = getAnimationByAction("hug", level)
  const giftAnimation = getAnimationByAction("gift", level)

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <div className="relative">
        <Button
          onClick={onPlay}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-base px-6 py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Jouer
        </Button>
        {playAnimation && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 shadow-lg animate-pulse">
            {playAnimation.icon}
          </Badge>
        )}
      </div>

      <div className="relative">
        <Button
          onClick={onFeed}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base px-6 py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          <Utensils className="mr-2 h-5 w-5" />
          Nourrir
        </Button>
        {feedAnimation && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 shadow-lg animate-pulse">
            {feedAnimation.icon}
          </Badge>
        )}
      </div>

      <div className="relative">
        <Button
          onClick={onSleep}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-base px-6 py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          <Moon className="mr-2 h-5 w-5 fill-white" />
          Dormir
        </Button>
        {sleepAnimation && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 shadow-lg animate-pulse">
            {sleepAnimation.icon}
          </Badge>
        )}
      </div>

      <div className="relative">
        <Button
          onClick={onWash}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-base px-6 py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          <Droplets className="mr-2 h-5 w-5" />
          Laver
        </Button>
        {washAnimation && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 shadow-lg animate-pulse">
            {washAnimation.icon}
          </Badge>
        )}
      </div>

      <div className="relative">
        <Button
          onClick={onHeal}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-base px-6 py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          <Pill className="mr-2 h-5 w-5" />
          Soigner
        </Button>
        {healAnimation && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 shadow-lg animate-pulse">
            {healAnimation.icon}
          </Badge>
        )}
      </div>

      <div className="relative">
        <Button
          onClick={onHug}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-base px-6 py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          <Heart className="mr-2 h-5 w-5 fill-white" />
          Câliner
        </Button>
        {hugAnimation && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 shadow-lg animate-pulse">
            {hugAnimation.icon}
          </Badge>
        )}
      </div>

      <div className="relative">
        <Button
          onClick={onGift}
          disabled={disabled}
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold text-base px-6 py-5 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 hover:shadow-xl"
        >
          <Gift className="mr-2 h-5 w-5" />
          Cadeau
        </Button>
        {giftAnimation && (
          <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5 shadow-lg animate-pulse">
            {giftAnimation.icon}
          </Badge>
        )}
      </div>
    </div>
  )
}
