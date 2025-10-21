"use client"

import { usePathname } from "next/navigation"
import { PublicHeader } from "@/components/public-header"

export function NavigationWrapper() {
  const pathname = usePathname()

  if (pathname?.startsWith("/auth")) {
    return null
  }

  return <PublicHeader />
}
