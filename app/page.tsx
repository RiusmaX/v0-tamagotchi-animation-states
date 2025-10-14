import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Heart, ShoppingBag, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
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
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-6 font-sans text-balance">
              Adoptez votre Tamagotchi Virtuel
            </h1>
            <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
              Créez, élevez et personnalisez vos petits monstres adorables en pixel art. Chaque monstre est unique et a
              besoin de votre attention !
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-500">
                <Link href="/auth/sign-up">Commencer gratuitement</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                <Link href="/auth/login">Se connecter</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-300 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Monstres Uniques</h3>
              <p className="text-muted-foreground">
                Générez des monstres aléatoires avec des couleurs, formes et styles uniques en pixel art
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Prenez-en soin</h3>
              <p className="text-muted-foreground">
                Nourrissez, jouez et faites dormir vos monstres pour les garder heureux et en bonne santé
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Accessoires</h3>
              <p className="text-muted-foreground">
                Gagnez des pièces et achetez des chapeaux, lunettes et chaussures pour personnaliser vos monstres
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 hover:border-yellow-300 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Collection Illimitée</h3>
              <p className="text-muted-foreground">
                Créez autant de monstres que vous voulez et gérez votre collection personnelle
              </p>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="p-12 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border-2 border-purple-300">
              <h2 className="text-4xl font-bold mb-4 text-foreground text-balance">
                Prêt à adopter votre premier monstre ?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 text-balance">
                Rejoignez des milliers de joueurs et commencez votre aventure dès maintenant
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-pink-500 to-purple-500">
                <Link href="/auth/sign-up">Créer mon compte gratuitement</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-200 mt-20 py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Tarifs
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
