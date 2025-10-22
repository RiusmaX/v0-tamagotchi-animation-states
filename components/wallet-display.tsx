"use client"

import { useEffect, useState } from "react"
import { Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUserCoins } from "@/lib/currency"
import { Skeleton } from "@/components/ui/skeleton"
import { walletEvents } from "@/lib/wallet-events"

export function WalletDisplay() {
  const router = useRouter()
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

    const unsubscribe = walletEvents.subscribe(async () => {
      const userCoins = await getUserCoins()
      setCoins(userCoins)
    })

    const interval = setInterval(async () => {
      const userCoins = await getUserCoins()
      setCoins(userCoins)
    }, 30000)

    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [])

  if (isLoading || coins === null) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-4 py-2 rounded-full border-2 border-yellow-400 dark:border-yellow-600 shadow-md">
        <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        <Skeleton className="h-5 w-12" />
      </div>
    )
  }

  return (
    <button
      onClick={() => router.push("/buy-coins")}
      className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 px-4 py-2 rounded-full border-2 border-yellow-400 dark:border-yellow-600 shadow-md hover:shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer active:scale-95"
    >
      <Coins className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      <span className="font-bold text-yellow-800 dark:text-yellow-200 tracking-wider">{coins}</span>
    </button>
  )
}
