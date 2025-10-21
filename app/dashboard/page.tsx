import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MonsterList } from "@/components/monster-list"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mes Monstres",
  description: "Gérez tous vos petits monstres adorables",
}

export const revalidate = 30

async function DashboardContent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: monsters, error } = await supabase
    .from("monsters")
    .select("*, level, xp")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching monsters:", error)
  }

  return <MonsterList monsters={monsters || []} userId={user.id} />
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 bg-pink-200 rounded-full opacity-20 float-animation" />
        <div
          className="absolute top-40 right-32 w-12 h-12 bg-purple-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-40 w-20 h-20 bg-blue-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-14 h-14 bg-yellow-200 rounded-full opacity-20 float-animation"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 mt-8">
          <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3 font-sans text-5xl">
            🐾 Mes Tamagotchis
          </h1>
          <p className="text-muted-foreground text-xl font-medium">Gérez tous vos petits monstres adorables</p>
        </div>

        <DashboardContent />
      </div>
    </main>
  )
}
