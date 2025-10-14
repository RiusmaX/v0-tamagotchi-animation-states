import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Header } from "@/components/header"
import "./globals.css"

export const metadata: Metadata = {
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
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Header />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
