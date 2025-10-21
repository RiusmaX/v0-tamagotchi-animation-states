"use client"

import { useCallback, useRef } from "react"

type SoundType = "action" | "coin" | "success" | "error"

const SOUND_URLS: Record<SoundType, string> = {
  action: "/sounds/action.mp3",
  coin: "/sounds/coin.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
}

export function useSound() {
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map())

  const play = useCallback((type: SoundType, volume = 0.5) => {
    try {
      let audio = audioRefs.current.get(type)

      if (!audio) {
        audio = new Audio(SOUND_URLS[type])
        audio.volume = volume
        audioRefs.current.set(type, audio)
      }

      audio.currentTime = 0
      audio.play().catch((error) => {
        console.log("[v0] Audio play failed:", error)
      })
    } catch (error) {
      console.log("[v0] Sound error:", error)
    }
  }, [])

  return { play }
}
