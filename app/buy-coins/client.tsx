"use client"
import { Coins, Sparkles, TrendingUp, Zap, ArrowLeft } from "lucide-react"
import { COIN_PACKAGES } from "@/lib/products"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StripeCheckout from "@/components/stripe-checkout"
import { useState } from "react"
import Link from "next/link"

export default function BuyCoinsClient() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  // NOTE: We need to fetch the user on the server for security reasons.
  // If the user is not logged in, redirect them to the login page.
  // This check is done in the server component (app/buy-coins/page.tsx).

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" size="lg" className="tracking-wider bg-transparent">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour au Dashboard
          </Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">Acheter des Pièces</h1>
        <p className="text-lg text-muted-foreground tracking-wide">
          Obtenez plus de pièces pour personnaliser vos monstres
        </p>
      </div>

      {selectedPackage ? (
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => setSelectedPackage(null)} className="mb-6 tracking-wider">
            ← Retour aux packs
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="tracking-wider">Paiement sécurisé</CardTitle>
              <CardDescription className="tracking-wide">Complétez votre achat avec Stripe</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <StripeCheckout productId={selectedPackage} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COIN_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative ${
                pkg.popular ? "border-primary shadow-lg scale-105" : "hover:border-primary/50"
              } transition-all`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold tracking-wider">
                  POPULAIRE
                </div>
              )}
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {pkg.coins === 10 && <Coins className="w-8 h-8 text-primary" />}
                  {pkg.coins === 30 && <Zap className="w-8 h-8 text-primary" />}
                  {pkg.coins === 100 && <TrendingUp className="w-8 h-8 text-primary" />}
                  {pkg.coins === 500 && <Sparkles className="w-8 h-8 text-primary" />}
                </div>
                <CardTitle className="text-2xl tracking-wider">{pkg.name}</CardTitle>
                <CardDescription className="tracking-wide">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <div className="text-4xl font-bold tracking-wider">{pkg.coins}</div>
                  <div className="text-sm text-muted-foreground tracking-wide">pièces</div>
                </div>
                <div className="text-3xl font-bold text-primary tracking-wider">
                  {(pkg.priceInCents / 100).toFixed(2)}€
                </div>
                <Button
                  className="w-full tracking-wider"
                  size="lg"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  Acheter
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 text-center text-sm text-muted-foreground tracking-wide">
        <p>Paiement sécurisé par Stripe • Aucun abonnement • Pièces ajoutées instantanément</p>
      </div>
    </div>
  )
}
