"use client"

import { useEffect, useState } from "react"
import { Coins } from "lucide-react"

type CoinParticle = {
  id: number
  x: number
  y: number
}

export function CoinAnimation({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<CoinParticle[]>([])

  useEffect(() => {
    if (trigger > 0) {
      const newParticle: CoinParticle = {
        id: Date.now(),
        x: Math.random() * 100 - 50,
        y: 0,
      }
      setParticles((prev) => [...prev, newParticle])

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
      }, 2000)
    }
  }, [trigger])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-1/2 left-1/2 animate-coin-float"
          style={{
            transform: `translate(${particle.x}px, ${particle.y}px)`,
          }}
        >
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-300 to-amber-400 px-3 py-1.5 rounded-full border-2 border-yellow-500 shadow-lg">
            <Coins className="h-4 w-4 text-yellow-700" />
            <span className="font-bold text-yellow-800 text-sm">+1</span>
          </div>
        </div>
      ))}
    </div>
  )
}
