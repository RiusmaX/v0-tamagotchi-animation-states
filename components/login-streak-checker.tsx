"use client"

import { useEffect, useState } from "react"
import { LoginStreakModal } from "./login-streak-modal"
import { emitWalletUpdate } from "@/lib/wallet-events"

interface StreakData {
  streak: number
  coinsEarned: number
  message: string
}

export function LoginStreakChecker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check login streak on mount
    const checkStreak = async () => {
      try {
        const response = await fetch("/api/check-login-streak", {
          method: "POST",
        })

        if (response.ok) {
          const data = await response.json()

          // Only show modal if it's a new day and coins were earned
          if (data.isNewDay && data.coinsEarned > 0) {
            setStreakData(data)
            setShowModal(true)
            // Update wallet display
            emitWalletUpdate()
          }
        } else {
          console.warn("Login streak check failed, feature may not be available yet")
        }
      } catch (error) {
        console.warn("Login streak feature not available:", error)
      }
    }

    checkStreak()
  }, [])

  if (!showModal || !streakData) return null

  return (
    <LoginStreakModal
      streak={streakData.streak}
      coinsEarned={streakData.coinsEarned}
      message={streakData.message}
      onClose={() => setShowModal(false)}
    />
  )
}
