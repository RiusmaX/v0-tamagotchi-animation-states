import type { Metadata } from "next"
import BuyCoinsClient from "./client"

export const metadata: Metadata = {
  title: "Acheter des Pièces | Tamagotchi",
  description: "Achetez des pièces pour personnaliser vos monstres",
}

export default function BuyCoinsPage() {
  return <BuyCoinsClient />
}
