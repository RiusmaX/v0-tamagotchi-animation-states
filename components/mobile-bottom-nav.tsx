"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, User, Trophy, Users } from "lucide-react"
import { WalletDisplay } from "@/components/wallet-display"

export function MobileBottomNav() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-background/95 backdrop-blur-xl border-2 border-border rounded-3xl shadow-2xl">
        <div className="flex items-center justify-around h-20 px-2">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
              isActive("/dashboard")
                ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white scale-105 shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <div className="relative">
              <Sparkles className="h-6 w-6" />
              {isActive("/dashboard") && <div className="absolute -inset-1 bg-white/20 rounded-full animate-pulse" />}
            </div>
            <span className="text-xs font-bold tracking-wider">Monstres</span>
          </Link>

          <Link
            href="/gallery"
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
              isActive("/gallery")
                ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white scale-105 shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <div className="relative">
              <Users className="h-6 w-6" />
              {isActive("/gallery") && <div className="absolute -inset-1 bg-white/20 rounded-full animate-pulse" />}
            </div>
            <span className="text-xs font-bold tracking-wider">Galerie</span>
          </Link>

          <Link
            href="/quests"
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
              isActive("/quests")
                ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-white scale-105 shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <div className="relative">
              <Trophy className="h-6 w-6" />
              {isActive("/quests") && <div className="absolute -inset-1 bg-white/20 rounded-full animate-pulse" />}
            </div>
            <span className="text-xs font-bold tracking-wider">Quêtes</span>
          </Link>

          <div className="flex items-center justify-center px-2">
            <WalletDisplay />
          </div>

          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
              isActive("/profile")
                ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white scale-105 shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            <div className="relative">
              <User className="h-6 w-6" />
              {isActive("/profile") && <div className="absolute -inset-1 bg-white/20 rounded-full animate-pulse" />}
            </div>
            <span className="text-xs font-bold tracking-wider">Profil</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
