export interface CoinPackage {
  id: string
  name: string
  description: string
  coins: number
  priceInCents: number
  popular?: boolean
}

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: "coins-10",
    name: "Petit Sac",
    description: "10 pièces pour commencer",
    coins: 10,
    priceInCents: 100, // 1€
  },
  {
    id: "coins-30",
    name: "Sac Moyen",
    description: "30 pièces pour progresser",
    coins: 30,
    priceInCents: 200, // 2€
    popular: true,
  },
  {
    id: "coins-100",
    name: "Grand Sac",
    description: "100 pièces pour les passionnés",
    coins: 100,
    priceInCents: 500, // 5€
  },
  {
    id: "coins-500",
    name: "Coffre au Trésor",
    description: "500 pièces pour les collectionneurs",
    coins: 500,
    priceInCents: 1000, // 10€
  },
]
