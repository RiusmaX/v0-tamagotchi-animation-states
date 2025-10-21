"use client"

import { useEffect, useState } from "react"
import { Coins } from "lucide-react"
import { getUserCoins } from "@/lib/currency"
import { Skeleton } from "@/components/ui/skeleton"
import { walletEvents } from "@/lib/wallet-events"

export function WalletDisplay() {
  const [coins, setCoins] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCoins = async () => {
      setIsLoading(true)
      const userCoins = await getUserCoins()
      setCoins(userCoins)
      setIsLoading(false)
    }

    loadCoins()

    const unsubscribe = walletEvents.subscribe((newCoins) => {
      setCoins(newCoins)
    })

    const interval = setInterval(async () => {
      const userCoins = await getUserCoins()
      setCoins(userCoins)
    }, 3000)

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [])

  if (isLoading || coins === null) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-md">
        <Coins className="h-5 w-5 text-yellow-600" />
        <Skeleton className="h-5 w-12" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 rounded-full border-2 border-yellow-400 shadow-md">
      <Coins className="h-5 w-5 text-yellow-600" />
      <span className="font-bold text-yellow-800">{coins}</span>
    </div>
  )
}
