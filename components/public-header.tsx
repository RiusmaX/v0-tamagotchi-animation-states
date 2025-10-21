"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function PublicHeader() {
  const pathname = usePathname()

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`
    } else {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl tracking-wider hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <div className="absolute inset-0 h-6 w-6 text-primary animate-ping opacity-20" />
          </div>
          <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Tamagotchi
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scrollToSection("accueil")}
            className="px-3 py-2 text-base font-bold rounded-md transition-all text-muted-foreground hover:bg-accent hover:text-accent-foreground tracking-wider"
          >
            Accueil
          </button>
          <button
            onClick={() => scrollToSection("fonctionnalites")}
            className="px-3 py-2 text-base font-bold rounded-md transition-all text-muted-foreground hover:bg-accent hover:text-accent-foreground tracking-wider"
          >
            Fonctionnalités
          </button>
        </nav>

        <Button
          asChild
          className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 tracking-wider text-base font-bold"
        >
          <Link href="/dashboard">Commencer</Link>
        </Button>
      </div>
    </header>
  )
}
