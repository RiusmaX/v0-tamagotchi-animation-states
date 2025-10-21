"use client"

import { Card } from "@/components/ui/card"

type MonsterState = "happy" | "sad" | "hungry" | "sleepy" | "sick" | "dirty" | "bored" | "excited"

interface StatusDisplayProps {
  state: MonsterState
}

export function StatusDisplay({ state }: StatusDisplayProps) {
  const statusMessages = {
    happy: {
      emoji: "💖",
      text: "Je suis super heureux !",
      color: "text-pink-600",
      bg: "bg-gradient-to-r from-pink-100 to-pink-50",
      border: "border-pink-300",
    },
    sad: {
      emoji: "💙",
      text: "Je me sens triste...",
      color: "text-blue-600",
      bg: "bg-gradient-to-r from-blue-100 to-blue-50",
      border: "border-blue-300",
    },
    hungry: {
      emoji: "🍎",
      text: "J'ai trop faim !",
      color: "text-red-600",
      bg: "bg-gradient-to-r from-red-100 to-red-50",
      border: "border-red-300",
    },
    sleepy: {
      emoji: "💤",
      text: "Je suis fatigué...",
      color: "text-purple-600",
      bg: "bg-gradient-to-r from-purple-100 to-purple-50",
      border: "border-purple-300",
    },
    sick: {
      emoji: "🤒",
      text: "Je ne me sens pas bien...",
      color: "text-green-600",
      bg: "bg-gradient-to-r from-green-100 to-green-50",
      border: "border-green-300",
    },
    dirty: {
      emoji: "💩",
      text: "J'ai besoin d'un bain !",
      color: "text-amber-700",
      bg: "bg-gradient-to-r from-amber-100 to-amber-50",
      border: "border-amber-300",
    },
    bored: {
      emoji: "😐",
      text: "Je m'ennuie...",
      color: "text-gray-600",
      bg: "bg-gradient-to-r from-gray-100 to-gray-50",
      border: "border-gray-300",
    },
    excited: {
      emoji: "🎉",
      text: "Je suis trop excité !",
      color: "text-yellow-600",
      bg: "bg-gradient-to-r from-yellow-100 to-yellow-50",
      border: "border-yellow-300",
    },
  }

  const status = statusMessages[state]

  return (
    <Card className={`${status.bg} border-3 ${status.border} p-3 sm:p-4 shadow-lg`}>
      <div className="flex items-center justify-center gap-3">
        <div className="text-3xl sm:text-4xl animate-bounce">{status.emoji}</div>
        <p className={`text-base sm:text-lg font-bold ${status.color}`}>{status.text}</p>
      </div>
    </Card>
  )
}
