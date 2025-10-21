"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Coins, Loader2 } from "lucide-react"
import { useSound } from "@/hooks/use-sound"

export default function SuccessContent({ sessionId }: { sessionId?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const playSound = useSound()

  useEffect(() => {
    if (!sessionId) {
      setError("Session invalide")
      setLoading(false)
      return
    }

    // Play success sound
    playSound("success")

    // Wait a bit to ensure webhook has processed
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId, playSound])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive tracking-wider">Erreur</CardTitle>
            <CardDescription className="tracking-wide">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/buy-coins")} className="tracking-wider">
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg tracking-wide">Traitement de votre paiement...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-3xl tracking-wider">Paiement Réussi !</CardTitle>
          <CardDescription className="text-lg tracking-wide">
            Vos pièces ont été ajoutées à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-6 text-center">
            <Coins className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-lg text-muted-foreground tracking-wide">
              Vos pièces sont maintenant disponibles pour personnaliser vos monstres !
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => router.push("/dashboard")} className="flex-1 tracking-wider" size="lg">
              Voir mes monstres
            </Button>
            <Button
              onClick={() => router.push("/buy-coins")}
              variant="outline"
              className="flex-1 tracking-wider"
              size="lg"
            >
              Acheter plus de pièces
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
