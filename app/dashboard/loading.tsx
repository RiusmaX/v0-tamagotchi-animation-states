import { MonsterCardSkeleton } from "@/components/skeletons/monster-card-skeleton"

export default function DashboardLoading() {
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
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-3 font-sans">
            🐾 Mes Tamagotchis
          </h1>
          <p className="text-muted-foreground text-xl font-medium">Gérez tous vos petits monstres adorables</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <MonsterCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}
