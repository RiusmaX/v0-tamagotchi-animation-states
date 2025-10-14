"use client"

import { useEffect, useState } from "react"
import { Coins } from "lucide-react"
import { getUserCoins } from "@/lib/currency"

export function WalletDisplay() {
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    const loadCoins = async () => {
      const userCoins = await getUserCoins()
      setCoins(userCoins)
    }

    loadCoins()

    // Refresh coins every 5 seconds
    const interval = setInterval(loadCoins, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-md">
      <Coins className="h-5 w-5 text-yellow-600" />
      <span className="font-bold text-yellow-800">{coins}</span>
    </div>
  )
}
