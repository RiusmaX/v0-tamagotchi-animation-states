export type MonsterState = "happy" | "sad" | "hungry" | "sleepy" | "sick" | "dirty" | "bored" | "excited"

/**
 * Calculate the current state of a monster based on time elapsed since last state change
 * Monsters change state every 1-3 minutes on average (2 minutes)
 */
export function calculateMonsterState(lastStateChange: string | undefined, currentState: MonsterState): MonsterState {
  if (!lastStateChange) return currentState

  const now = new Date()
  const lastChange = new Date(lastStateChange)
  const minutesElapsed = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60))

  // If the monster is already in a need state (not happy or excited), keep it
  if (currentState !== "happy" && currentState !== "excited") {
    return currentState
  }

  // Check if enough time has passed (minimum 1 minute)
  if (minutesElapsed < 1) {
    return currentState
  }

  // Calculate state changes (average 2 minutes per change)
  const stateChanges = Math.floor(minutesElapsed / 2)

  if (stateChanges === 0) {
    return currentState
  }

  // Cycle through need states
  const needStates: MonsterState[] = ["sad", "hungry", "sleepy", "sick", "dirty", "bored"]
  const stateIndex = stateChanges % needStates.length

  return needStates[stateIndex]
}

/**
 * Get a random interval between 1 and 3 minutes in milliseconds
 */
export function getRandomStateChangeInterval(): number {
  return Math.floor(Math.random() * 120000) + 60000 // 60000ms = 1min, 120000ms = 2min
}

/**
 * Determine if an action resolves the current state
 */
export function getActionForState(state: MonsterState): string | null {
  const actionStateMap: Record<string, MonsterState> = {
    play: "bored",
    feed: "hungry",
    sleep: "sleepy",
    wash: "dirty",
    heal: "sick",
    hug: "sad",
  }

  for (const [action, targetState] of Object.entries(actionStateMap)) {
    if (targetState === state) {
      return action
    }
  }

  return null
}
