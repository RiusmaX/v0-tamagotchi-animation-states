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
