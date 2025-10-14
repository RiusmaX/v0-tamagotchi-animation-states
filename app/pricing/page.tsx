import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Coins } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Achetez des pièces pour personnaliser vos monstres avec des accessoires uniques",
}

const pricingPlans = [
  {
    coins: 10,
    price: 1,
    popular: false,
    color: "from-pink-400 to-pink-600",
    borderColor: "border-pink-300",
  },
  {
    coins: 30,
    price: 2,
    popular: true,
    color: "from-purple-400 to-purple-600",
    borderColor: "border-purple-300",
    badge: "Populaire",
  },
  {
    coins: 100,
    price: 5,
    popular: false,
    color: "from-blue-400 to-blue-600",
    borderColor: "border-blue-300",
  },
  {
    coins: 500,
    price: 10,
    popular: false,
    color: "from-yellow-400 to-yellow-600",
    borderColor: "border-yellow-300",
    badge: "Meilleure valeur",
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full opacity-20 float-animation" />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-40 w-40 h-40 bg-blue-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-6 font-sans text-balance">
            Achetez des Pièces
          </h1>
          <p className="text-2xl text-muted-foreground mb-4 text-balance">
            Obtenez des pièces pour acheter des accessoires et personnaliser vos monstres
          </p>
          <p className="text-lg text-muted-foreground text-balance">
            Vous pouvez aussi gagner des pièces gratuitement en prenant soin de vos monstres !
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.coins}
              className={`relative p-8 bg-white/80 backdrop-blur-sm border-2 ${plan.borderColor} hover:shadow-xl transition-all ${
                plan.popular ? "scale-105 shadow-lg" : ""
              }`}
            >
              {plan.badge && (
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${plan.color} text-white text-sm font-bold rounded-full`}
                >
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center`}
                >
                  <Coins className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-foreground mb-2">{plan.coins}</div>
                <div className="text-muted-foreground text-lg">pièces</div>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-foreground mb-1">{plan.price}€</div>
                <div className="text-muted-foreground">paiement unique</div>
              </div>

              <Button className={`w-full bg-gradient-to-r ${plan.color} text-white text-lg py-6`} size="lg">
                Acheter maintenant
              </Button>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Que pouvez-vous faire avec vos pièces ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Chapeaux</h3>
                <p className="text-muted-foreground">Ajoutez des chapeaux stylés à vos monstres</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Lunettes</h3>
                <p className="text-muted-foreground">Équipez vos monstres de lunettes cool</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-foreground">Chaussures</h3>
                <p className="text-muted-foreground">Donnez du style avec des chaussures uniques</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore de compte ?</p>
          <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
            <Link href="/auth/sign-up">Créer un compte gratuitement</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-200 py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Accueil
            </Link>
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Connexion
            </Link>
          </div>
          <p className="text-muted-foreground">© 2025 Tamagotchi Virtuel. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  )
}
