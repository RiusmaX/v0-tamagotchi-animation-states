import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Heart, ShoppingBag, Users, TrendingUp, Coins } from "lucide-react"
import { RandomMonsterPreview } from "@/components/random-monster-preview"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section id="accueil" className="relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4 sm:mb-6 font-sans text-balance">
              Adoptez votre Tamagotchi Virtuel
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto text-balance px-4">
              Créez, élevez et personnalisez vos petits monstres adorables en pixel art. Chaque monstre est unique et a
              besoin de votre attention !
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-pink-500 to-purple-500 w-full sm:w-auto"
              >
                <Link href="/auth/sign-up">Commencer gratuitement</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-transparent w-full sm:w-auto"
              >
                <Link href="/auth/login">Se connecter</Link>
              </Button>
            </div>
          </div>

          <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mb-8">
            <Card className="p-8 sm:p-12 bg-white/80 backdrop-blur-sm border-2 border-purple-300 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-wider">
                Découvrez un monstre unique
              </h2>
              <p className="text-center text-muted-foreground mb-8 tracking-wide">
                Chaque monstre est généré aléatoirement avec des couleurs, formes et styles uniques. Rechargez la page
                pour en voir un nouveau !
              </p>
              <div className="flex justify-center">
                <RandomMonsterPreview />
              </div>
            </Card>
          </section>

          <section id="fonctionnalites" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 tracking-wider">
              Fonctionnalités
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-pink-200 hover:border-pink-300 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground tracking-wider">Monstres Uniques</h3>
                <p className="text-muted-foreground tracking-wide">
                  Générez des monstres aléatoires avec des couleurs, formes et styles uniques en pixel art
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground tracking-wider">Prenez-en soin</h3>
                <p className="text-muted-foreground tracking-wide">
                  Nourrissez, jouez et faites dormir vos monstres pour les garder heureux et en bonne santé
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-emerald-200 hover:border-emerald-300 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground tracking-wider">Système de Niveaux</h3>
                <p className="text-muted-foreground tracking-wide">
                  Gagnez de l'XP en prenant soin de vos monstres et débloquez de nouveaux niveaux
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-amber-200 hover:border-amber-300 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground tracking-wider">Gagnez des Pièces</h3>
                <p className="text-muted-foreground tracking-wide">
                  Gagnez des pièces en jouant et dépensez-les dans la boutique d'accessoires
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground tracking-wider">Boutique d'Accessoires</h3>
                <p className="text-muted-foreground tracking-wide">
                  Achetez des chapeaux, lunettes et chaussures pour personnaliser vos monstres
                </p>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-violet-200 hover:border-violet-300 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-violet-600 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground tracking-wider">Collection Illimitée</h3>
                <p className="text-muted-foreground tracking-wide">
                  Créez autant de monstres que vous voulez et gérez votre collection personnelle
                </p>
              </Card>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 tracking-wider">
              Comment ça marche ?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-wider">Créez votre monstre</h3>
                <p className="text-muted-foreground tracking-wide">
                  Générez un monstre unique avec des caractéristiques aléatoires en pixel art
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-wider">Prenez-en soin</h3>
                <p className="text-muted-foreground tracking-wide">
                  Nourrissez, jouez et faites dormir votre monstre pour gagner de l'XP et des pièces
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-wider">Personnalisez</h3>
                <p className="text-muted-foreground tracking-wide">
                  Achetez des accessoires dans la boutique et créez le style parfait pour votre monstre
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <Card className="p-6 sm:p-8 md:p-12 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border-2 border-purple-300 shadow-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-foreground text-balance tracking-wider">
                Prêt à adopter votre premier monstre ?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 text-balance tracking-wide">
                Rejoignez des milliers de joueurs et commencez votre aventure dès maintenant
              </p>
              <Button
                asChild
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-pink-500 to-purple-500 w-full sm:w-auto tracking-wider"
              >
                <Link href="/auth/sign-up">Créer mon compte gratuitement</Link>
              </Button>
            </Card>
          </section>

          {/* Footer */}
          <footer className="border-t border-purple-200 mt-20 py-8 bg-white/50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="flex justify-center gap-6 mb-4">
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tarifs
                </Link>
                <Link
                  href="/auth/login"
                  className="text-muted-foreground hover:text-foreground transition-colors tracking-wide"
                >
                  Connexion
                </Link>
              </div>
              <p className="text-muted-foreground tracking-wide">© 2025 Tamagotchi Virtuel. Tous droits réservés.</p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  )
}
