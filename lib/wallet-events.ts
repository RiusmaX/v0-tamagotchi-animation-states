type WalletListener = (coins: number) => void

class WalletEventEmitter {
  private listeners: WalletListener[] = []

  subscribe(listener: WalletListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  emit(coins: number) {
    this.listeners.forEach((listener) => listener(coins))
  }
}

export const walletEvents = new WalletEventEmitter()

export function emitWalletUpdate() {
  // Emit with 0 as a signal to refresh, the actual value will be fetched by the listener
  walletEvents.emit(0)
}
