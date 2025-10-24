"use client"

import { useEffect, useState } from "react"
import { PixelMonster, type MonsterTraits } from "./pixel-monster"

const bodyColors = ["#FFB5E8", "#FF9CEE", "#B5DEFF", "#C7CEEA", "#FFDAC1", "#E2F0CB", "#FFD3B6", "#FFAAA5"]
const accentColors = ["#FF9CEE", "#FFB5E8", "#A0C4FF", "#9DB4C0", "#FFC09F", "#D4E09B", "#FFAB91", "#FF8A80"]
const eyeColors = ["#2C2C2C", "#4A4A4A", "#1E3A8A", "#7C2D12", "#065F46"]
const antennaColors = ["#FFE66D", "#FFB5E8", "#B5DEFF", "#C7CEEA", "#FFDAC1"]
const bobbleColors = ["#FFE66D", "#FF6B9D", "#7DD3FC", "#A78BFA", "#FCD34D"]
const cheekColors = ["#FFB5D5", "#FFC1CC", "#FFD4E5", "#FFE5EC"]

const bodyStyles: Array<"round" | "square" | "tall" | "wide"> = ["round", "square", "tall", "wide"]
const eyeStyles: Array<"big" | "small" | "star" | "sleepy"> = ["big", "small", "star", "sleepy"]
const antennaStyles: Array<"single" | "double" | "curly" | "none"> = ["single", "double", "curly", "none"]
const accessoryStyles: Array<"horns" | "ears" | "tail" | "none"> = ["horns", "ears", "tail", "none"]

function generateRandomMonster(): MonsterTraits {
  return {
    bodyColor: bodyColors[Math.floor(Math.random() * bodyColors.length)],
    accentColor: accentColors[Math.floor(Math.random() * accentColors.length)],
    eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)],
    antennaColor: antennaColors[Math.floor(Math.random() * antennaColors.length)],
    bobbleColor: bobbleColors[Math.floor(Math.random() * bobbleColors.length)],
    cheekColor: cheekColors[Math.floor(Math.random() * cheekColors.length)],
    bodyStyle: bodyStyles[Math.floor(Math.random() * bodyStyles.length)],
    eyeStyle: eyeStyles[Math.floor(Math.random() * eyeStyles.length)],
    antennaStyle: antennaStyles[Math.floor(Math.random() * antennaStyles.length)],
    accessory: accessoryStyles[Math.floor(Math.random() * accessoryStyles.length)],
  }
}

export function RandomMonsterPreview() {
  const [traits, setTraits] = useState<MonsterTraits | null>(null)

  useEffect(() => {
    // Generate random monster on mount
    setTraits(generateRandomMonster())
  }, [])

  if (!traits) {
    return (
      <div className="w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4 shadow-lg">
      <PixelMonster state="happy" traits={traits} />
    </div>
  )
}
