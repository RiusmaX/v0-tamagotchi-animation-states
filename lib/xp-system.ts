// XP System for Monster Progression

export const XP_PER_ACTION = {
  play: 10,
  feed: 15,
  sleep: 5,
  wash: 8,
  heal: 12,
  hug: 10,
  gift: 20,
} as const

export const MAX_LEVEL = 50

// Calculate XP required for a specific level
// Formula: level * 100 (level 1→2 = 100 XP, level 2→3 = 200 XP, etc.)
export function getXPRequiredForLevel(level: number): number {
  return level * 100
}

// Calculate total XP required to reach a specific level
export function getTotalXPForLevel(level: number): number {
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPRequiredForLevel(i)
  }
  return total
}

// Calculate level and remaining XP from total XP
export function calculateLevelFromXP(totalXP: number): { level: number; currentXP: number; xpForNextLevel: number } {
  let level = 1
  let remainingXP = totalXP

  while (level < MAX_LEVEL) {
    const xpRequired = getXPRequiredForLevel(level)
    if (remainingXP < xpRequired) {
      break
    }
    remainingXP -= xpRequired
    level++
  }

  const xpForNextLevel = level < MAX_LEVEL ? getXPRequiredForLevel(level) : 0

  return {
    level,
    currentXP: remainingXP,
    xpForNextLevel,
  }
}

// Add XP and return new level info
export function addXP(
  currentTotalXP: number,
  xpToAdd: number,
): {
  newTotalXP: number
  newLevel: number
  newCurrentXP: number
  xpForNextLevel: number
  leveledUp: boolean
  oldLevel: number
} {
  const oldLevelInfo = calculateLevelFromXP(currentTotalXP)
  const newTotalXP = Math.min(currentTotalXP + xpToAdd, getTotalXPForLevel(MAX_LEVEL))
  const newLevelInfo = calculateLevelFromXP(newTotalXP)

  return {
    newTotalXP,
    newLevel: newLevelInfo.level,
    newCurrentXP: newLevelInfo.currentXP,
    xpForNextLevel: newLevelInfo.xpForNextLevel,
    leveledUp: newLevelInfo.level > oldLevelInfo.level,
    oldLevel: oldLevelInfo.level,
  }
}

// Get progress percentage for current level
export function getLevelProgress(currentXP: number, xpForNextLevel: number): number {
  if (xpForNextLevel === 0) return 100 // Max level reached
  return Math.round((currentXP / xpForNextLevel) * 100)
}
