import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { GameNav } from "@/components/game-nav"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { createClient } from "@/lib/supabase/server"
import { NavigationWrapper } from "@/components/navigation-wrapper" // Import NavigationWrapper component
import { LoginStreakChecker } from "@/components/login-streak-checker"
import { PWAInstaller } from "@/components/pwa-installer"
import "./globals.css"
import { Jersey_25 } from "next/font/google"

const jersey = Jersey_25({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jersey",
})

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: {
    default: "Tamagotchi Virtuel - Élevez vos petits monstres adorables",
    template: "%s | Tamagotchi Virtuel",
  },
  description:
    "Adoptez et prenez soin de vos propres monstres virtuels en pixel art. Nourrissez-les, jouez avec eux et collectionnez des accessoires uniques !",
  keywords: ["tamagotchi", "monstre virtuel", "pixel art", "jeu en ligne", "animal virtuel", "élevage", "collection"],
  authors: [{ name: "Tamagotchi Virtuel" }],
  creator: "Tamagotchi Virtuel",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://tamagotchi-virtuel.vercel.app",
    title: "Tamagotchi Virtuel - Élevez vos petits monstres adorables",
    description:
      "Adoptez et prenez soin de vos propres monstres virtuels en pixel art. Nourrissez-les, jouez avec eux et collectionnez des accessoires uniques !",
    siteName: "Tamagotchi Virtuel",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tamagotchi Virtuel - Petits monstres en pixel art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tamagotchi Virtuel - Élevez vos petits monstres adorables",
    description:
      "Adoptez et prenez soin de vos propres monstres virtuels en pixel art. Nourrissez-les, jouez avec eux et collectionnez des accessoires uniques !",
    images: ["/og-image.png"],
    creator: "@tamagotchi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tamagotchi",
  },
  generator: "v0.app",
}

async function LayoutContent({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      {user ? (
        <>
          <GameNav />
          <MobileBottomNav />
          <LoginStreakChecker />
        </>
      ) : (
        <NavigationWrapper />
      )}
      <div className={user ? "lg:pb-0 pb-20" : ""}>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          {children}
        </Suspense>
      </div>
      <PWAInstaller />
    </>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tamagotchi" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.jpg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.jpg" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.jpg" />
      </head>
      <body className={`font-sans ${jersey.variable} ${GeistMono.variable}`}>
        <LayoutContent>{children}</LayoutContent>
        <Analytics />
      </body>
    </html>
  )
}
