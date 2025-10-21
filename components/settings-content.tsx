"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Coins, Sparkles } from "lucide-react"
import Link from "next/link"
import { addCoins } from "@/lib/currency"
import { WalletDisplay } from "@/components/wallet-display"
import { useRouter } from "next/navigation"

export function SettingsContent() {
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const handleAddCoins = async () => {
    setIsAdding(true)
    try {
      await addCoins(10)
      router.refresh()
      setTimeout(() => {
        setIsAdding(false)
      }, 1000)
    } catch (error) {
      console.error("[v0] Error adding coins:", error)
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 mt-8">
        <Link href="/profile">
          <Button variant="outline" size="lg" className="tracking-wider bg-transparent">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour
          </Button>
        </Link>
        <WalletDisplay />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3 font-sans">
          ⚙️ Paramètres
        </h1>
        <p className="text-muted-foreground text-xl font-medium">Gérez votre compte et vos préférences</p>
      </div>

      <div className="space-y-6">
        <Card className="p-8 shadow-xl border-4 border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl border-2 border-yellow-400">
              <Coins className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Portefeuille</h2>
              <p className="text-muted-foreground mb-4">
                Gérez vos coins et vos achats. Les coins sont gagnés en prenant soin de vos monstres.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 shadow-xl border-4 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-purple-400">
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Mode Triche</h2>
              <p className="text-muted-foreground mb-4">
                Besoin de coins rapidement ? Utilisez ce bouton pour ajouter 10 coins instantanément !
              </p>
            </div>
          </div>
          <Button
            onClick={handleAddCoins}
            disabled={isAdding}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-6"
          >
            {isAdding ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-5 w-5" />
                Ajouter +10 Coins
              </>
            )}
          </Button>
        </Card>

        <Card className="p-8 shadow-xl border-4 border-border bg-card/95 backdrop-blur-sm">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium">💡 Astuce</p>
            <p className="mt-2">
              Vous pouvez gagner des coins en effectuant des actions avec vos monstres. Chaque action rapporte 1 coin !
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}
