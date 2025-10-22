"use client"

import { useEffect, useRef } from "react"
import { ACCESSORIES, getRarityBackground, type AccessoryRarity } from "@/lib/currency"

interface AccessoryPreviewProps {
  accessoryId: string
  rarity: AccessoryRarity
}

export function AccessoryPreview({ accessoryId, rarity }: AccessoryPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)

  const accessory = ACCESSORIES.find((acc) => acc.id === accessoryId)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !accessory) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 128
    canvas.height = 128

    let animationId: number

    const animate = () => {
      frameRef.current += 1
      drawAccessoryOnly(ctx, accessory.id, accessory.type, frameRef.current)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [accessory])

  if (!accessory) {
    return null
  }

  return (
    <div className={`w-32 h-32 mx-auto flex items-center justify-center rounded-lg ${getRarityBackground(rarity)}`}>
      <canvas ref={canvasRef} className="pixel-art w-full h-full" style={{ imageRendering: "pixelated" }} />
    </div>
  )
}

function drawAccessoryOnly(
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  type: "hat" | "glasses" | "shoes",
  frame: number,
) {
  const pixelSize = 6
  ctx.clearRect(0, 0, 128, 128)

  // Center position for the accessory
  const centerX = 64
  const centerY = 64

  ctx.fillStyle = getAccessoryColor(accessoryId)

  if (type === "hat") {
    drawHatOnly(ctx, accessoryId, centerX, centerY, pixelSize, frame)
  } else if (type === "glasses") {
    drawGlassesOnly(ctx, accessoryId, centerX, centerY, pixelSize, frame)
  } else if (type === "shoes") {
    drawShoesOnly(ctx, accessoryId, centerX, centerY, pixelSize, frame)
  }
}

function drawHatOnly(
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  x: number,
  y: number,
  pixelSize: number,
  frame: number,
) {
  if (accessoryId.includes("party")) {
    ctx.fillRect(x - 12, y + 12, pixelSize * 4, pixelSize)
    ctx.fillRect(x - 9, y + 6, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x - 6, y, pixelSize * 2, pixelSize * 2)
    ctx.fillStyle = "#FFE66D"
    ctx.fillRect(x - 3, y - 3, pixelSize, pixelSize)
  } else if (accessoryId.includes("crown")) {
    ctx.fillRect(x - 15, y + 9, pixelSize * 5, pixelSize)
    ctx.fillRect(x - 15, y + 3, pixelSize, pixelSize * 2)
    ctx.fillRect(x - 6, y, pixelSize, pixelSize * 3)
    ctx.fillRect(x + 21, y + 3, pixelSize, pixelSize * 2)
    ctx.fillStyle = "#FFE66D"
    ctx.fillRect(x - 6, y - 3, pixelSize, pixelSize)
  } else if (accessoryId.includes("cap") || accessoryId.includes("beanie")) {
    ctx.fillRect(x - 15, y + 12, pixelSize * 5, pixelSize * 2)
    ctx.fillRect(x - 21, y + 15, pixelSize * 3, pixelSize)
  } else if (accessoryId.includes("wizard")) {
    ctx.fillRect(x - 12, y + 12, pixelSize * 4, pixelSize)
    ctx.fillRect(x - 9, y + 6, pixelSize * 3, pixelSize * 3)
    ctx.fillRect(x - 6, y, pixelSize * 2, pixelSize * 3)
    ctx.fillStyle = "#FFE66D"
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(x - 9 + i * 6, y + 9 + i * 3, pixelSize / 2, pixelSize / 2)
    }
  } else if (accessoryId.includes("halo")) {
    ctx.fillStyle = "#FFE66D"
    ctx.fillRect(x - 18, y - 6, pixelSize * 6, pixelSize)
    ctx.fillRect(x - 18, y - 9, pixelSize, pixelSize)
    ctx.fillRect(x + 24, y - 9, pixelSize, pixelSize)
    const glow = Math.abs(Math.sin(frame * 0.1))
    ctx.globalAlpha = 0.3 + glow * 0.3
    ctx.fillRect(x - 21, y - 9, pixelSize * 7, pixelSize * 2)
    ctx.globalAlpha = 1
  } else if (accessoryId.includes("dragon")) {
    ctx.fillStyle = "#DC2626"
    ctx.fillRect(x - 18, y + 9, pixelSize * 6, pixelSize * 3)
    ctx.fillRect(x - 21, y + 12, pixelSize, pixelSize * 2)
    ctx.fillRect(x + 27, y + 12, pixelSize, pixelSize * 2)
    ctx.fillRect(x - 24, y + 6, pixelSize, pixelSize * 2)
    ctx.fillRect(x + 30, y + 6, pixelSize, pixelSize * 2)
    ctx.fillStyle = "#FFE66D"
    ctx.fillRect(x - 9, y + 12, pixelSize * 2, pixelSize)
  }
}

function drawGlassesOnly(
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  x: number,
  y: number,
  pixelSize: number,
  frame: number,
) {
  if (accessoryId.includes("cool")) {
    ctx.fillRect(x - 24, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x + 6, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x - 15, y, pixelSize * 3, pixelSize)
  } else if (accessoryId.includes("nerd") || accessoryId.includes("reading")) {
    ctx.strokeStyle = getAccessoryColor(accessoryId)
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x - 18, y, 8, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x + 12, y, 8, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillRect(x - 10, y, pixelSize * 2, 2)
  } else if (accessoryId.includes("star")) {
    ctx.fillRect(x - 21, y - 3, pixelSize * 2, pixelSize)
    ctx.fillRect(x - 18, y - 6, pixelSize, pixelSize)
    ctx.fillRect(x - 18, y + 3, pixelSize, pixelSize)
    ctx.fillRect(x + 9, y - 3, pixelSize * 2, pixelSize)
    ctx.fillRect(x + 12, y - 6, pixelSize, pixelSize)
    ctx.fillRect(x + 12, y + 3, pixelSize, pixelSize)
  } else if (accessoryId.includes("heart")) {
    ctx.fillStyle = "#FF6B9D"
    ctx.fillRect(x - 24, y, pixelSize, pixelSize)
    ctx.fillRect(x - 21, y - 3, pixelSize, pixelSize)
    ctx.fillRect(x - 18, y, pixelSize, pixelSize)
    ctx.fillRect(x - 21, y + 3, pixelSize, pixelSize)
    ctx.fillRect(x + 6, y, pixelSize, pixelSize)
    ctx.fillRect(x + 9, y - 3, pixelSize, pixelSize)
    ctx.fillRect(x + 12, y, pixelSize, pixelSize)
    ctx.fillRect(x + 9, y + 3, pixelSize, pixelSize)
  } else if (accessoryId.includes("cyber")) {
    ctx.fillStyle = "#00FFFF"
    ctx.fillRect(x - 24, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x + 6, y - 3, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(x - 15, y, pixelSize * 3, pixelSize)
    ctx.fillStyle = "#FF00FF"
    ctx.fillRect(x - 21, y - 3, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(x + 9, y - 3, pixelSize / 2, pixelSize / 2)
  } else if (accessoryId.includes("rainbow")) {
    const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#8B00FF"]
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = colors[i]
      ctx.fillRect(x - 24 + i, y - 3, pixelSize / 2, pixelSize * 2)
      ctx.fillRect(x + 6 + i, y - 3, pixelSize / 2, pixelSize * 2)
    }
    ctx.fillRect(x - 15, y, pixelSize * 3, 2)
  }
}

function drawShoesOnly(
  ctx: CanvasRenderingContext2D,
  accessoryId: string,
  x: number,
  y: number,
  pixelSize: number,
  frame: number,
) {
  if (accessoryId.includes("sneakers")) {
    ctx.fillRect(x - 30, y, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x + 18, y, pixelSize * 4, pixelSize * 2)
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(x - 27, y, pixelSize * 2, pixelSize)
    ctx.fillRect(x + 21, y, pixelSize * 2, pixelSize)
  } else if (accessoryId.includes("boots")) {
    ctx.fillRect(x - 30, y - 3, pixelSize * 4, pixelSize * 5)
    ctx.fillRect(x + 18, y - 3, pixelSize * 4, pixelSize * 5)
  } else if (accessoryId.includes("slippers") || accessoryId.includes("sandals")) {
    ctx.fillRect(x - 30, y, pixelSize * 4, pixelSize)
    ctx.fillRect(x + 18, y, pixelSize * 4, pixelSize)
    ctx.fillStyle = "#FFB5E8"
    ctx.fillRect(x - 27, y - 3, pixelSize, pixelSize)
    ctx.fillRect(x + 21, y - 3, pixelSize, pixelSize)
  } else if (accessoryId.includes("rocket")) {
    ctx.fillStyle = "#DC2626"
    ctx.fillRect(x - 30, y - 3, pixelSize * 4, pixelSize * 5)
    ctx.fillRect(x + 18, y - 3, pixelSize * 4, pixelSize * 5)
    ctx.fillStyle = "#FFE66D"
    const flameOffset = Math.abs(Math.sin(frame * 0.2)) * 3
    ctx.fillRect(x - 27, y + 3 + flameOffset, pixelSize, pixelSize * 2)
    ctx.fillRect(x + 21, y + 3 + flameOffset, pixelSize, pixelSize * 2)
    ctx.fillStyle = "#FF6B35"
    ctx.fillRect(x - 24, y + 6 + flameOffset, pixelSize / 2, pixelSize)
    ctx.fillRect(x + 24, y + 6 + flameOffset, pixelSize / 2, pixelSize)
  } else if (accessoryId.includes("ice")) {
    ctx.fillStyle = "#E0F2FE"
    ctx.fillRect(x - 30, y, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x + 18, y, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x - 33, y + 3, pixelSize * 2, pixelSize / 2)
    ctx.fillRect(x + 27, y + 3, pixelSize * 2, pixelSize / 2)
    ctx.fillStyle = "#7DD3FC"
    ctx.fillRect(x - 27, y, pixelSize, pixelSize)
    ctx.fillRect(x + 21, y, pixelSize, pixelSize)
  } else if (accessoryId.includes("wings")) {
    ctx.fillStyle = "#FFB5E8"
    ctx.fillRect(x - 30, y, pixelSize * 4, pixelSize * 2)
    ctx.fillRect(x + 18, y, pixelSize * 4, pixelSize * 2)
    const wingFlap = Math.sin(frame * 0.15) * 3
    ctx.fillStyle = "#FF6B9D"
    ctx.fillRect(x - 36, y - 3 + wingFlap, pixelSize * 2, pixelSize)
    ctx.fillRect(x - 39, y + wingFlap, pixelSize * 3, pixelSize)
    ctx.fillRect(x + 24, y - 3 + wingFlap, pixelSize * 2, pixelSize)
    ctx.fillRect(x + 27, y + wingFlap, pixelSize * 3, pixelSize)
  }
}

function getAccessoryColor(accessoryId: string): string {
  if (accessoryId.includes("party")) return "#FF6B9D"
  if (accessoryId.includes("crown")) return "#FFD700"
  if (accessoryId.includes("cap")) return "#3B82F6"
  if (accessoryId.includes("beanie")) return "#8B4513"
  if (accessoryId.includes("wizard")) return "#8B5CF6"
  if (accessoryId.includes("halo")) return "#FFE66D"
  if (accessoryId.includes("dragon")) return "#DC2626"
  if (accessoryId.includes("cool")) return "#2C2C2C"
  if (accessoryId.includes("nerd")) return "#8B4513"
  if (accessoryId.includes("reading")) return "#6B7280"
  if (accessoryId.includes("star")) return "#FFE66D"
  if (accessoryId.includes("heart")) return "#FF6B9D"
  if (accessoryId.includes("cyber")) return "#00FFFF"
  if (accessoryId.includes("rainbow")) return "#FF0000"
  if (accessoryId.includes("sneakers")) return "#EF4444"
  if (accessoryId.includes("boots")) return "#8B4513"
  if (accessoryId.includes("slippers")) return "#FFB5E8"
  if (accessoryId.includes("sandals")) return "#F59E0B"
  if (accessoryId.includes("rocket")) return "#DC2626"
  if (accessoryId.includes("ice")) return "#E0F2FE"
  if (accessoryId.includes("wings")) return "#FFB5E8"
  return "#2C2C2C"
}
