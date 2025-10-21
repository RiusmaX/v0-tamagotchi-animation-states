"use client"

import { useCallback, useRef } from "react"

type SoundType = "action" | "coin" | "success" | "error"

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playAction = useCallback(() => {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = 440
    oscillator.type = "square"

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [getAudioContext])

  const playCoin = useCallback(() => {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(988, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1319, ctx.currentTime + 0.1)
    oscillator.type = "square"

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [getAudioContext])

  const playSuccess = useCallback(() => {
    const ctx = getAudioContext()

    // Play a sequence of notes for success jingle
    const notes = [523, 659, 784, 1047] // C, E, G, C (one octave higher)
    const duration = 0.15

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = freq
      oscillator.type = "square"

      const startTime = ctx.currentTime + index * duration
      gainNode.gain.setValueAtTime(0.2, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    })
  }, [getAudioContext])

  const playError = useCallback(() => {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.setValueAtTime(200, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2)
    oscillator.type = "sawtooth"

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  }, [getAudioContext])

  const play = useCallback(
    (type: SoundType) => {
      try {
        switch (type) {
          case "action":
            playAction()
            break
          case "coin":
            playCoin()
            break
          case "success":
            playSuccess()
            break
          case "error":
            playError()
            break
        }
      } catch (error) {
        console.log("[v0] Sound error:", error)
      }
    },
    [playAction, playCoin, playSuccess, playError],
  )

  return { play }
}
