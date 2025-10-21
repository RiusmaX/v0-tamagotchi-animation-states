"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, User } from "lucide-react"

export function MobileBottomNav() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t shadow-lg">
      <div className="flex items-center justify-around h-20 px-4">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all ${
            isActive("/dashboard")
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110 shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <Sparkles className="h-6 w-6" />
            {isActive("/dashboard") && <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />}
          </div>
          <span className="text-base font-bold tracking-widest">Monstres</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 px-6 py-2 rounded-2xl transition-all ${
            isActive("/profile")
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110 shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="relative">
            <User className="h-6 w-6" />
            {isActive("/profile") && <div className="absolute inset-0 bg-white/30 rounded-full animate-ping" />}
          </div>
          <span className="text-base font-bold tracking-widest">Profil</span>
        </Link>
      </div>
    </nav>
  )
}
