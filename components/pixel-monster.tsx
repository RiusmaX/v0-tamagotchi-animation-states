"use client"

import { useEffect, useRef } from "react"

type MonsterState = "happy" | "sad" | "hungry" | "sleepy" | "sick" | "dirty" | "bored" | "excited"
type ActionAnimation = "play" | "feed" | "sleep" | "wash" | "heal" | "hug" | "gift" | null

export type MonsterStyle = "round" | "square" | "tall" | "wide"
export type EyeStyle = "big" | "small" | "star" | "sleepy"
export type AntennaStyle = "single" | "double" | "curly" | "none"
export type AccessoryStyle = "horns" | "ears" | "tail" | "none"

export interface MonsterTraits {
  bodyColor: string
  accentColor: string
  eyeColor: string
  antennaColor: string
  bobbleColor: string
  cheekColor: string
  bodyStyle: MonsterStyle
  eyeStyle: EyeStyle
  antennaStyle: AntennaStyle
  accessory: AccessoryStyle
}

interface PixelMonsterProps {
  state: MonsterState
  actionAnimation?: ActionAnimation
  traits?: MonsterTraits
}

const defaultTraits: MonsterTraits = {
  bodyColor: "#FFB5E8",
  accentColor: "#FF9CEE",
  eyeColor: "#2C2C2C",
  antennaColor: "#FFE66D",
  bobbleColor: "#FFE66D",
  cheekColor: "#FFB5D5",
  bodyStyle: "round",
  eyeStyle: "big",
  antennaStyle: "single",
  accessory: "none",
}

export function PixelMonster({ state, actionAnimation, traits = defaultTraits }: PixelMonsterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const actionFrameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 160
    canvas.height = 160

    let animationId: number

    const animate = () => {
      frameRef.current += 1
      if (actionAnimation) {
        actionFrameRef.current += 1
      } else {
        actionFrameRef.current = 0
      }
      drawMonster(ctx, state, frameRef.current, actionAnimation, actionFrameRef.current, traits)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [state, actionAnimation, traits])

  return <canvas ref={canvasRef} className="pixel-art w-full h-full mx-auto" style={{ imageRendering: "pixelated" }} />
}

function drawMonster(
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  frame: number,
  actionAnimation: ActionAnimation,
  actionFrame: number,
  traits: MonsterTraits,
) {
  const pixelSize = 6
  const bounce = Math.sin(frame * 0.05) * 3

  ctx.clearRect(0, 0, 160, 160)

  let bodyColor = traits.bodyColor
  let accentColor = traits.accentColor

  if (state === "sad") {
    bodyColor = adjustColorBrightness(traits.bodyColor, -20)
    accentColor = adjustColorBrightness(traits.accentColor, -20)
  }
  if (state === "hungry") {
    bodyColor = adjustColorBrightness(traits.bodyColor, 10)
    accentColor = adjustColorBrightness(traits.accentColor, 10)
  }
  if (state === "sleepy") {
    bodyColor = adjustColorBrightness(traits.bodyColor, -10)
    accentColor = adjustColorBrightness(traits.accentColor, -10)
  }
  if (state === "sick") {
    bodyColor = adjustColorToGreen(traits.bodyColor)
    accentColor = adjustColorToGreen(traits.accentColor)
  }
  if (state === "dirty") {
    bodyColor = adjustColorBrightness(traits.bodyColor, -30)
    accentColor = adjustColorBrightness(traits.accentColor, -30)
  }
  if (state === "excited") {
    bodyColor = adjustColorBrightness(traits.bodyColor, 20)
    accentColor = adjustColorBrightness(traits.accentColor, 20)
  }

  let extraBounce = 0
  if (actionAnimation === "play") {
    extraBounce = Math.abs(Math.sin(actionFrame * 0.3)) * -25
  }
  if (state === "excited") {
    extraBounce = Math.abs(Math.sin(frame * 0.2)) * -8
  }
  if (actionAnimation === "hug") {
    extraBounce = Math.sin(actionFrame * 0.2) * -5
  }

  const bodyY = 55 + bounce + extraBounce

  drawBody(ctx, traits.bodyStyle, bodyColor, accentColor, bodyY, pixelSize)

  drawEyes(ctx, traits.eyeStyle, traits.eyeColor, state, bodyY, pixelSize, frame)

  drawMouth(ctx, state, traits.eyeColor, traits.cheekColor, bodyY, pixelSize, frame)

  const armWave = Math.sin(frame * 0.1) * 5
  ctx.fillStyle = bodyColor
  ctx.fillRect(33, bodyY + 30 + armWave, pixelSize, pixelSize * 3)
  ctx.fillRect(27, bodyY + 33 + armWave, pixelSize, pixelSize * 2)
  ctx.fillRect(123, bodyY + 30 - armWave, pixelSize, pixelSize * 3)
  ctx.fillRect(129, bodyY + 33 - armWave, pixelSize, pixelSize * 2)

  ctx.fillRect(57, bodyY + 54, pixelSize * 3, pixelSize * 2)
  ctx.fillRect(105, bodyY + 54, pixelSize * 3, pixelSize * 2)

  drawAntenna(ctx, traits.antennaStyle, traits.antennaColor, traits.bobbleColor, bodyY, pixelSize, frame)

  drawAccessory(ctx, traits.accessory, traits.accentColor, bodyY, pixelSize, frame)

  drawStateEffects(ctx, state, bodyY, pixelSize, frame)

  drawActionAnimations(ctx, actionAnimation, actionFrame, bodyY, pixelSize)
}

function drawBody(
  ctx: CanvasRenderingContext2D,
  style: MonsterStyle,
  bodyColor: string,
  accentColor: string,
  bodyY: number,
  pixelSize: number,
) {
  ctx.fillStyle = accentColor

  switch (style) {
    case "round":
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 11; x++) {
          if (
            (y === 0 && x >= 3 && x <= 7) ||
            (y === 1 && x >= 2 && x <= 8) ||
            (y >= 2 && y <= 7 && x >= 1 && x <= 9) ||
            (y === 8 && x >= 2 && x <= 8)
          ) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 8; y++) {
        for (let x = 2; x < 9; x++) {
          if (y >= 2 && y <= 6) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 7) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 7 && x >= 3 && x <= 7) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break

    case "square":
      for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 11; x++) {
          if (x >= 1 && x <= 9) {
            ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 8; y++) {
        for (let x = 2; x < 9; x++) {
          ctx.fillRect(45 + x * pixelSize, bodyY + y * pixelSize, pixelSize, pixelSize)
        }
      }
      break

    case "tall":
      for (let y = 0; y < 11; y++) {
        for (let x = 0; x < 9; x++) {
          if (
            (y === 0 && x >= 2 && x <= 6) ||
            (y === 1 && x >= 1 && x <= 7) ||
            (y >= 2 && y <= 9 && x >= 1 && x <= 7) ||
            (y === 10 && x >= 2 && x <= 6)
          ) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 10; y++) {
        for (let x = 2; x < 7; x++) {
          if (y >= 2 && y <= 8) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 5) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 9 && x >= 3 && x <= 5) {
            ctx.fillRect(51 + x * pixelSize, bodyY - 12 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break

    case "wide":
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 13; x++) {
          if (
            (y === 0 && x >= 3 && x <= 9) ||
            (y === 1 && x >= 2 && x <= 10) ||
            (y >= 2 && y <= 5 && x >= 1 && x <= 11) ||
            (y === 6 && x >= 2 && x <= 10)
          ) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      ctx.fillStyle = bodyColor
      for (let y = 1; y < 6; y++) {
        for (let x = 2; x < 11; x++) {
          if (y >= 2 && y <= 4) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 1 && x >= 3 && x <= 9) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          } else if (y === 5 && x >= 3 && x <= 9) {
            ctx.fillRect(39 + x * pixelSize, bodyY + 6 + y * pixelSize, pixelSize, pixelSize)
          }
        }
      }
      break
  }
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  style: EyeStyle,
  eyeColor: string,
  state: MonsterState,
  bodyY: number,
  pixelSize: number,
  frame: number,
) {
  ctx.fillStyle = eyeColor

  if (state === "sleepy") {
    ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
    ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
    return
  }

  const eyeBlink = Math.floor(frame / 80) % 12 === 0

  if (eyeBlink) {
    ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
    ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
    return
  }

  switch (style) {
    case "big":
      ctx.fillRect(63, bodyY + 21, pixelSize * 2, pixelSize * 2)
      ctx.fillRect(93, bodyY + 21, pixelSize * 2, pixelSize * 2)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(66, bodyY + 21, pixelSize, pixelSize)
      ctx.fillRect(96, bodyY + 21, pixelSize, pixelSize)
      ctx.fillRect(69, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(99, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case "small":
      ctx.fillRect(66, bodyY + 24, pixelSize, pixelSize)
      ctx.fillRect(96, bodyY + 24, pixelSize, pixelSize)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(66, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(96, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case "star":
      ctx.fillRect(66, bodyY + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(96, bodyY + 21, pixelSize, pixelSize * 2)
      ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(66, bodyY + 24, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(96, bodyY + 24, pixelSize / 2, pixelSize / 2)
      break

    case "sleepy":
      ctx.fillRect(63, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(93, bodyY + 24, pixelSize * 2, pixelSize)
      ctx.fillRect(63, bodyY + 21, pixelSize * 2, pixelSize / 2)
      ctx.fillRect(93, bodyY + 21, pixelSize * 2, pixelSize / 2)
      break
  }
}

function drawMouth(
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  eyeColor: string,
  cheekColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number,
) {
  ctx.fillStyle = eyeColor

  if (state === "happy") {
    ctx.fillRect(75, bodyY + 42, pixelSize * 3, pixelSize)
    ctx.fillRect(69, bodyY + 39, pixelSize, pixelSize)
    ctx.fillRect(105, bodyY + 39, pixelSize, pixelSize)

    ctx.fillStyle = cheekColor
    ctx.fillRect(57, bodyY + 36, pixelSize * 2, pixelSize)
    ctx.fillRect(111, bodyY + 36, pixelSize * 2, pixelSize)
  } else if (state === "sad") {
    ctx.fillRect(75, bodyY + 39, pixelSize * 3, pixelSize)
    ctx.fillRect(69, bodyY + 42, pixelSize, pixelSize)
    ctx.fillRect(105, bodyY + 42, pixelSize, pixelSize)
  } else if (state === "hungry") {
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 4; x++) {
        if ((y === 0 && x >= 1 && x <= 2) || y === 1 || (y === 2 && x >= 1 && x <= 2)) {
          ctx.fillRect(75 + x * pixelSize, bodyY + 36 + y * pixelSize, pixelSize, pixelSize)
        }
      }
    }
  } else if (state === "sleepy") {
    ctx.fillRect(78, bodyY + 42, pixelSize * 2, pixelSize)
  } else if (state === "sick") {
    ctx.fillRect(72, bodyY + 42, pixelSize, pixelSize)
    ctx.fillRect(75, bodyY + 39, pixelSize, pixelSize)
    ctx.fillRect(78, bodyY + 42, pixelSize, pixelSize)
    ctx.fillRect(81, bodyY + 39, pixelSize, pixelSize)
    ctx.fillRect(84, bodyY + 42, pixelSize, pixelSize)
  } else if (state === "dirty") {
    ctx.fillRect(75, bodyY + 42, pixelSize * 2, pixelSize)
  } else if (state === "bored") {
    ctx.fillRect(72, bodyY + 42, pixelSize * 4, pixelSize)
  } else if (state === "excited") {
    ctx.fillRect(72, bodyY + 42, pixelSize * 4, pixelSize)
    ctx.fillRect(66, bodyY + 39, pixelSize, pixelSize)
    ctx.fillRect(108, bodyY + 39, pixelSize, pixelSize)

    ctx.fillStyle = cheekColor
    ctx.fillRect(57, bodyY + 36, pixelSize * 2, pixelSize)
    ctx.fillRect(111, bodyY + 36, pixelSize * 2, pixelSize)
  }
}

function drawAntenna(
  ctx: CanvasRenderingContext2D,
  style: AntennaStyle,
  antennaColor: string,
  bobbleColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number,
) {
  const bobbleY = bodyY - 24 + Math.sin(frame * 0.08) * 4

  switch (style) {
    case "single":
      ctx.fillStyle = antennaColor
      ctx.fillRect(78, bodyY - 12, pixelSize, pixelSize * 3)
      ctx.fillStyle = bobbleColor
      ctx.fillRect(72, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(75, bobbleY + 3, pixelSize, pixelSize)
      break

    case "double":
      ctx.fillStyle = antennaColor
      ctx.fillRect(69, bodyY - 12, pixelSize, pixelSize * 3)
      ctx.fillRect(87, bodyY - 12, pixelSize, pixelSize * 3)
      ctx.fillStyle = bobbleColor
      ctx.fillRect(63, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillRect(81, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(66, bobbleY + 3, pixelSize, pixelSize)
      ctx.fillRect(84, bobbleY + 3, pixelSize, pixelSize)
      break

    case "curly":
      ctx.fillStyle = antennaColor
      const curvePoints = [
        { x: 78, y: bodyY - 12 },
        { x: 84, y: bodyY - 15 },
        { x: 84, y: bodyY - 21 },
        { x: 78, y: bodyY - 24 },
      ]
      curvePoints.forEach((point) => {
        ctx.fillRect(point.x, point.y, pixelSize, pixelSize)
      })
      ctx.fillStyle = bobbleColor
      ctx.fillRect(72, bobbleY, pixelSize * 3, pixelSize * 3)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(75, bobbleY + 3, pixelSize, pixelSize)
      break

    case "none":
      break
  }
}

function drawAccessory(
  ctx: CanvasRenderingContext2D,
  accessory: AccessoryStyle,
  accentColor: string,
  bodyY: number,
  pixelSize: number,
  frame: number,
) {
  ctx.fillStyle = accentColor

  switch (accessory) {
    case "horns":
      ctx.fillRect(51, bodyY - 6, pixelSize, pixelSize * 2)
      ctx.fillRect(45, bodyY - 12, pixelSize, pixelSize * 2)
      ctx.fillRect(105, bodyY - 6, pixelSize, pixelSize * 2)
      ctx.fillRect(111, bodyY - 12, pixelSize, pixelSize * 2)
      break

    case "ears":
      ctx.fillRect(51, bodyY, pixelSize * 2, pixelSize)
      ctx.fillRect(51, bodyY - 6, pixelSize, pixelSize * 2)
      ctx.fillRect(105, bodyY, pixelSize * 2, pixelSize)
      ctx.fillRect(111, bodyY - 6, pixelSize, pixelSize * 2)
      break

    case "tail":
      const tailWag = Math.sin(frame * 0.15) * 6
      ctx.fillRect(117, bodyY + 36 + tailWag, pixelSize * 3, pixelSize)
      ctx.fillRect(129, bodyY + 30 + tailWag, pixelSize * 2, pixelSize)
      break

    case "none":
      break
  }
}

function drawStateEffects(
  ctx: CanvasRenderingContext2D,
  state: MonsterState,
  bodyY: number,
  pixelSize: number,
  frame: number,
) {
  if (state === "hungry") {
    ctx.strokeStyle = "#2C2C2C"
    ctx.lineWidth = 2
    const rumble = Math.sin(frame * 0.2) * 2
    ctx.beginPath()
    ctx.moveTo(51 + rumble, bodyY + 45)
    ctx.lineTo(39 + rumble, bodyY + 45)
    ctx.stroke()
  }

  if (state === "sleepy") {
    ctx.fillStyle = "#9B8FD4"
    const zOffset = (frame * 2) % 50
    ctx.font = "bold 20px monospace"
    ctx.fillText("z", 130, bodyY - zOffset)
    ctx.font = "bold 24px monospace"
    ctx.fillText("Z", 138, bodyY - zOffset - 15)
  }

  if (state === "sad") {
    if (Math.floor(frame / 30) % 4 === 0) {
      ctx.fillStyle = "#7DD3FC"
      const tearY = bodyY + 30 + (frame % 30) * 2
      ctx.fillRect(66, tearY, pixelSize, pixelSize * 2)
    }
  }

  if (state === "sick") {
    ctx.fillStyle = "#7DD3FC"
    const sweatY = bodyY + 15 + Math.abs(Math.sin(frame * 0.15)) * 10
    ctx.fillRect(54, sweatY, pixelSize, pixelSize * 2)
    ctx.fillRect(51, sweatY + 6, pixelSize / 2, pixelSize)

    ctx.fillStyle = "#FF6B6B"
    ctx.fillRect(120, bodyY + 10, pixelSize, pixelSize * 4)
    ctx.fillRect(120, bodyY + 6, pixelSize / 2, pixelSize)
  }

  if (state === "dirty") {
    ctx.fillStyle = "#8B7355"
    ctx.fillRect(60, bodyY + 18, pixelSize, pixelSize)
    ctx.fillRect(96, bodyY + 24, pixelSize, pixelSize)
    ctx.fillRect(75, bodyY + 45, pixelSize, pixelSize)
    ctx.fillRect(108, bodyY + 36, pixelSize, pixelSize)

    ctx.strokeStyle = "#8B7355"
    ctx.lineWidth = 2
    const stinkOffset = Math.sin(frame * 0.1) * 3
    ctx.beginPath()
    ctx.moveTo(45, bodyY - 5 + stinkOffset)
    ctx.lineTo(39, bodyY - 15 + stinkOffset)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(115, bodyY - 5 + stinkOffset)
    ctx.lineTo(121, bodyY - 15 + stinkOffset)
    ctx.stroke()
  }

  if (state === "bored") {
    ctx.fillStyle = "#D1D5DB"
    ctx.fillRect(120, bodyY - 15, pixelSize * 3, pixelSize * 2)
    ctx.fillRect(126, bodyY - 9, pixelSize, pixelSize)
    ctx.fillRect(129, bodyY - 6, pixelSize / 2, pixelSize / 2)

    ctx.fillStyle = "#6B7280"
    ctx.fillRect(123, bodyY - 12, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(129, bodyY - 12, pixelSize / 2, pixelSize / 2)
    ctx.fillRect(135, bodyY - 12, pixelSize / 2, pixelSize / 2)
  }

  if (state === "excited") {
    ctx.fillStyle = "#FFE66D"
    const sparklePositions = [
      { x: 30, y: bodyY - 10, phase: 0.15 },
      { x: 130, y: bodyY - 5, phase: 0.12 },
      { x: 40, y: bodyY + 20, phase: 0.18 },
      { x: 120, y: bodyY + 25, phase: 0.14 },
    ]

    sparklePositions.forEach((pos) => {
      const twinkle = Math.abs(Math.sin(frame * pos.phase))
      ctx.globalAlpha = twinkle
      ctx.fillRect(pos.x, pos.y, pixelSize, pixelSize)
      ctx.fillRect(pos.x - 3, pos.y, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(pos.x + 6, pos.y, pixelSize / 2, pixelSize / 2)
      ctx.globalAlpha = 1
    })
  }
}

function drawActionAnimations(
  ctx: CanvasRenderingContext2D,
  actionAnimation: ActionAnimation,
  actionFrame: number,
  bodyY: number,
  pixelSize: number,
) {
  if (actionAnimation === "play") {
    ctx.fillStyle = "#FF6B9D"
    const heart1Y = bodyY - 25 - (actionFrame % 35)
    const heart2Y = bodyY - 15 - ((actionFrame + 18) % 35)

    for (let i = 0; i < 2; i++) {
      const hY = i === 0 ? heart1Y : heart2Y
      const hX = i === 0 ? 20 : 130

      ctx.fillRect(hX, hY, pixelSize, pixelSize)
      ctx.fillRect(hX + 6, hY - 6, pixelSize, pixelSize)
      ctx.fillRect(hX + 12, hY, pixelSize, pixelSize)
      ctx.fillRect(hX + 3, hY - 3, pixelSize * 2, pixelSize)
      ctx.fillRect(hX + 3, hY + 3, pixelSize * 2, pixelSize * 2)
    }
  }

  if (actionAnimation === "feed") {
    ctx.fillStyle = "#FF6B35"
    const foodY = -25 + actionFrame * 3

    if (foodY < bodyY + 25) {
      ctx.fillRect(75, foodY, pixelSize * 3, pixelSize * 3)
      ctx.fillRect(69, foodY + 6, pixelSize * 4, pixelSize * 2)

      ctx.fillStyle = "#4CAF50"
      ctx.fillRect(87, foodY - 6, pixelSize, pixelSize * 2)
    } else {
      ctx.fillStyle = "#FFE66D"
      for (let i = 0; i < 5; i++) {
        const angle = (actionFrame * 0.2 + i * 1.2) % (Math.PI * 2)
        const sparkleX = 80 + Math.cos(angle) * 35
        const sparkleY = bodyY + 25 + Math.sin(angle) * 25
        ctx.fillRect(sparkleX, sparkleY, pixelSize, pixelSize)
      }
    }
  }

  if (actionAnimation === "sleep") {
    const pillowAlpha = Math.min(actionFrame / 20, 1)

    ctx.fillStyle = `rgba(255, 255, 255, ${pillowAlpha})`
    ctx.fillRect(51, bodyY + 60, pixelSize * 9, pixelSize * 3)

    ctx.fillStyle = "#FFE66D"
    const moonX = 120 + Math.sin(actionFrame * 0.1) * 6
    ctx.fillRect(moonX, 25, pixelSize * 3, pixelSize * 3)
    ctx.fillRect(moonX + 12, 19, pixelSize, pixelSize)
    ctx.fillRect(moonX + 12, 37, pixelSize, pixelSize)

    ctx.fillStyle = "#FFFFFF"
    const stars = [
      { x: 25, y: 35, phase: 0.15 },
      { x: 135, y: 45, phase: 0.12 },
      { x: 35, y: 55, phase: 0.18 },
    ]
    stars.forEach((star) => {
      const twinkle = Math.abs(Math.sin(actionFrame * star.phase))
      ctx.globalAlpha = twinkle
      ctx.fillRect(star.x, star.y, pixelSize, pixelSize)
      ctx.fillRect(star.x - 3, star.y, pixelSize / 2, pixelSize / 2)
      ctx.fillRect(star.x + 6, star.y, pixelSize / 2, pixelSize / 2)
      ctx.globalAlpha = 1
    })
  }

  if (actionAnimation === "wash") {
    ctx.fillStyle = "#E0F2FE"
    const bubbles = [
      { x: 60, y: bodyY - 10 - (actionFrame % 40), size: 2 },
      { x: 80, y: bodyY - 5 - ((actionFrame + 10) % 40), size: 3 },
      { x: 100, y: bodyY - 15 - ((actionFrame + 20) % 40), size: 2 },
      { x: 70, y: bodyY + 10 - ((actionFrame + 15) % 40), size: 2.5 },
    ]

    bubbles.forEach((bubble) => {
      ctx.globalAlpha = 0.8
      ctx.fillRect(bubble.x, bubble.y, pixelSize * bubble.size, pixelSize * bubble.size)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(bubble.x + 2, bubble.y + 2, pixelSize / 2, pixelSize / 2)
      ctx.fillStyle = "#E0F2FE"
      ctx.globalAlpha = 1
    })

    if (actionFrame > 20) {
      ctx.fillStyle = "#7DD3FC"
      for (let i = 0; i < 3; i++) {
        const dropY = bodyY + 20 + ((actionFrame - 20 + i * 5) % 30) * 2
        ctx.fillRect(65 + i * 15, dropY, pixelSize / 2, pixelSize)
      }
    }
  }

  if (actionAnimation === "heal") {
    if (actionFrame < 25) {
      ctx.fillStyle = "#EF4444"
      const bottleY = -20 + actionFrame * 2.5
      ctx.fillRect(75, bottleY, pixelSize * 3, pixelSize * 4)
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(78, bottleY + 6, pixelSize, pixelSize * 2)
      ctx.fillRect(75, bottleY - 3, pixelSize * 3, pixelSize)
    } else {
      ctx.fillStyle = "#10B981"
      const plusPositions = [
        { x: 60, y: bodyY - 10 },
        { x: 90, y: bodyY - 5 },
        { x: 75, y: bodyY + 10 },
      ]

      plusPositions.forEach((pos, i) => {
        const offset = ((actionFrame - 25 + i * 5) % 20) * 2
        ctx.fillRect(pos.x, pos.y - offset, pixelSize, pixelSize * 3)
        ctx.fillRect(pos.x - 6, pos.y + 6 - offset, pixelSize * 3, pixelSize)
      })
    }
  }

  if (actionAnimation === "hug") {
    ctx.fillStyle = "#FFB5E8"
    const hugProgress = Math.min(actionFrame / 20, 1)
    const armX = 40 - hugProgress * 15

    ctx.fillRect(armX, bodyY + 20, pixelSize * 2, pixelSize * 4)
    ctx.fillRect(160 - armX - 12, bodyY + 20, pixelSize * 2, pixelSize * 4)

    if (actionFrame > 15) {
      ctx.fillStyle = "#FF6B9D"
      const heartY = bodyY - 20 - ((actionFrame - 15) % 30)

      for (let i = 0; i < 3; i++) {
        const hY = heartY - i * 15
        const hX = 70 + i * 10

        ctx.fillRect(hX, hY, pixelSize / 2, pixelSize / 2)
        ctx.fillRect(hX + 3, hY - 3, pixelSize / 2, pixelSize / 2)
        ctx.fillRect(hX + 6, hY, pixelSize / 2, pixelSize / 2)
        ctx.fillRect(hX + 1.5, hY + 1.5, pixelSize, pixelSize)
      }
    }
  }

  if (actionAnimation === "gift") {
    if (actionFrame < 30) {
      ctx.fillStyle = "#F59E0B"
      const giftY = -20 + actionFrame * 2.5
      ctx.fillRect(72, giftY, pixelSize * 4, pixelSize * 4)

      ctx.fillStyle = "#EF4444"
      ctx.fillRect(78, giftY - 3, pixelSize, pixelSize * 5)
      ctx.fillRect(72, giftY + 6, pixelSize * 4, pixelSize)
    } else {
      ctx.fillStyle = "#F59E0B"
      const confettiColors = ["#F59E0B", "#EF4444", "#10B981", "#3B82F6", "#8B5CF6"]

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const distance = (actionFrame - 30) * 3
        const x = 80 + Math.cos(angle) * distance
        const y = bodyY + 20 + Math.sin(angle) * distance

        ctx.fillStyle = confettiColors[i % confettiColors.length]
        ctx.fillRect(x, y, pixelSize / 2, pixelSize)
      }
    }
  }
}

function adjustColorBrightness(hex: string, percent: number): string {
  const num = Number.parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent))
  const b = Math.min(255, Math.max(0, (num & 0xff) + percent))
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
}

function adjustColorToGreen(hex: string): string {
  const num = Number.parseInt(hex.replace("#", ""), 16)
  const r = Math.max(0, ((num >> 16) & 0xff) - 30)
  const g = Math.min(255, ((num >> 8) & 0xff) + 20)
  const b = Math.max(0, (num & 0xff) - 20)
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")
}
