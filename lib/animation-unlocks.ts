// Special animations that unlock at specific levels

export type SpecialAnimation = {
  id: string
  name: string
  description: string
  unlockLevel: number
  baseAction: "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift"
  icon: string
}

export const SPECIAL_ANIMATIONS: SpecialAnimation[] = [
  {
    id: "super_play",
    name: "Super Jeu",
    description: "Une version améliorée de Jouer avec des effets spéciaux !",
    unlockLevel: 5,
    baseAction: "play",
    icon: "✨",
  },
  {
    id: "feast",
    name: "Festin",
    description: "Un repas royal pour votre monstre !",
    unlockLevel: 8,
    baseAction: "feed",
    icon: "🍖",
  },
  {
    id: "dream",
    name: "Rêve Étoilé",
    description: "Un sommeil magique sous les étoiles",
    unlockLevel: 12,
    baseAction: "sleep",
    icon: "🌟",
  },
  {
    id: "spa",
    name: "Spa Luxe",
    description: "Un bain relaxant avec des bulles arc-en-ciel",
    unlockLevel: 15,
    baseAction: "wash",
    icon: "🛁",
  },
  {
    id: "mega_heal",
    name: "Méga Soin",
    description: "Guérison instantanée avec des effets magiques",
    unlockLevel: 18,
    baseAction: "heal",
    icon: "💫",
  },
  {
    id: "love_bomb",
    name: "Bombe d'Amour",
    description: "Une explosion de câlins et d'affection",
    unlockLevel: 22,
    baseAction: "hug",
    icon: "💝",
  },
  {
    id: "treasure",
    name: "Trésor",
    description: "Un cadeau légendaire rempli de surprises",
    unlockLevel: 25,
    baseAction: "gift",
    icon: "🎁",
  },
  {
    id: "ultra_play",
    name: "Ultra Jeu",
    description: "Le summum du divertissement !",
    unlockLevel: 30,
    baseAction: "play",
    icon: "🎮",
  },
  {
    id: "rainbow_wash",
    name: "Douche Arc-en-ciel",
    description: "Un nettoyage coloré et magique",
    unlockLevel: 35,
    baseAction: "wash",
    icon: "🌈",
  },
  {
    id: "divine_gift",
    name: "Cadeau Divin",
    description: "Le cadeau ultime pour votre monstre",
    unlockLevel: 40,
    baseAction: "gift",
    icon: "👑",
  },
]

export function getUnlockedAnimations(level: number): SpecialAnimation[] {
  return SPECIAL_ANIMATIONS.filter((anim) => level >= anim.unlockLevel)
}

export function getNextUnlockLevel(level: number): number | null {
  const nextAnimation = SPECIAL_ANIMATIONS.find((anim) => anim.unlockLevel > level)
  return nextAnimation ? nextAnimation.unlockLevel : null
}

export function getAnimationByAction(
  action: "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift",
  level: number,
): SpecialAnimation | null {
  const unlockedAnimations = getUnlockedAnimations(level)
  const animationsForAction = unlockedAnimations.filter((anim) => anim.baseAction === action)

  // Return the highest level animation for this action
  return animationsForAction.length > 0 ? animationsForAction[animationsForAction.length - 1] : null
}
