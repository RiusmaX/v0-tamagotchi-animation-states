class MonsterEventEmitter {
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: (data: any) => void) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }
}

export const monsterEvents = new MonsterEventEmitter()

export function emitMonsterUpdate(monsterId: string, state: string) {
  monsterEvents.emit("monster-update", { monsterId, state })
}

export function emitMonsterDeleted(monsterId: string) {
  monsterEvents.emit("monster-deleted", { monsterId })
}

export function emitMonsterRenamed(monsterId: string, name: string) {
  monsterEvents.emit("monster-renamed", { monsterId, name })
}
