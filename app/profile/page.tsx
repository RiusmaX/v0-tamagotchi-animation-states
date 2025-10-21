import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletDisplay } from "@/components/wallet-display"
import { Sparkles, Mail, Calendar } from "lucide-react"
import { Suspense } from "react"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"

export const metadata: Metadata = {
  title: "Mon Profil",
  description: "Gérez votre profil et vos informations",
}

async function ProfileContent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: monsters } = await supabase.from("monsters").select("*").eq("user_id", user.id)

  const { data: profile } = await supabase.from("user_profiles").select("coins").eq("user_id", user.id).maybeSingle()

  const totalCoins = profile?.coins || 0
  const totalMonsters = monsters?.length || 0

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3">
          Mon Profil
        </h1>
        <p className="text-muted-foreground text-lg">Gérez vos informations et statistiques</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-purple-500">
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-3xl font-bold">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">Informations du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Mail className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Membre depuis</p>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              Statistiques
            </CardTitle>
            <CardDescription>Vos performances dans le jeu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  {totalMonsters}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Monstres</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg text-center">
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                  {totalCoins}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Coins totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle>Portefeuille</CardTitle>
            <CardDescription>Votre solde actuel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <WalletDisplay />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen p-4 pb-24 lg:pb-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </main>
  )
}
