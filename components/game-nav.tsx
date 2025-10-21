"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, Settings, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { WalletDisplay } from "./wallet-display"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function GameNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="hidden lg:flex sticky top-0 z-50 w-full border-b bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Tamagotchi
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className={
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "hover:bg-purple-100"
                }
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Mes Monstres
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                className={
                  isActive("/profile")
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "hover:bg-purple-100"
                }
              >
                <User className="h-4 w-4 mr-2" />
                Profil
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                className={
                  isActive("/settings")
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : "hover:bg-purple-100"
                }
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <WalletDisplay />
          <Link href="/profile">
            <Avatar className="h-10 w-10 border-2 border-purple-500 cursor-pointer hover:border-purple-400 transition-colors">
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  )
}
