export interface Background {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  gradient: string // Kept for fallback
  pattern?: string
}

export const BACKGROUNDS: Background[] = [
  {
    id: "default",
    name: "Classique",
    price: 0,
    description: "L'arrière-plan par défaut",
    imageUrl: "",
    gradient: "from-pink-100/50 via-purple-100/50 to-blue-100/50",
  },
  {
    id: "forest",
    name: "Forêt enchantée",
    price: 30,
    description: "Une forêt mystique et verdoyante",
    imageUrl: "/backgrounds/forest.jpg",
    gradient: "from-green-200/50 via-emerald-200/50 to-teal-200/50",
    pattern: "🌲",
  },
  {
    id: "beach",
    name: "Plage tropicale",
    price: 35,
    description: "Une plage ensoleillée avec du sable chaud",
    imageUrl: "/backgrounds/beach.jpg",
    gradient: "from-yellow-200/50 via-orange-200/50 to-amber-200/50",
    pattern: "🏖️",
  },
  {
    id: "space",
    name: "Espace cosmique",
    price: 50,
    description: "L'immensité de l'espace avec des étoiles",
    imageUrl: "/backgrounds/space.jpg",
    gradient: "from-indigo-300/50 via-purple-300/50 to-pink-300/50",
    pattern: "⭐",
  },
  {
    id: "candy",
    name: "Pays des bonbons",
    price: 40,
    description: "Un monde sucré et coloré",
    imageUrl: "/backgrounds/candy.jpg",
    gradient: "from-pink-300/50 via-rose-300/50 to-fuchsia-300/50",
    pattern: "🍭",
  },
  {
    id: "ocean",
    name: "Fond marin",
    price: 45,
    description: "Les profondeurs mystérieuses de l'océan",
    imageUrl: "/backgrounds/ocean.jpg",
    gradient: "from-cyan-300/50 via-blue-300/50 to-indigo-300/50",
    pattern: "🐠",
  },
]

export function getBackgroundById(id: string): Background | undefined {
  return BACKGROUNDS.find((bg) => bg.id === id)
}

export function getBackgroundStyle(id: string): { backgroundImage?: string; className?: string } {
  const background = getBackgroundById(id)
  if (!background) {
    return { className: `bg-gradient-to-br ${BACKGROUNDS[0].gradient}` }
  }

  if (background.imageUrl) {
    return { backgroundImage: `url(${background.imageUrl})` }
  }

  return { className: `bg-gradient-to-br ${background.gradient}` }
}
