'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

interface AudioContextType {
  toggleAudio: () => void
  isAudioEnabled: boolean
  playSound: (soundName: string) => void
  playAmbient: (soundName: string) => void
  stopAmbient: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

const SOUND_FILES: Record<string, string> = {
  'paper-rustle': '/audio/paper-rustle.wav',
  'envelope-open': '/audio/envelope-tear.wav',
  'page-turn': '/audio/page-turn.wav',
  'projector-click': '/audio/projector-click.wav',
}

const AMBIENT_FILES: Record<string, string> = {
  projector: '/audio/projector-hum.wav',
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const ambientRef = useRef<HTMLAudioElement | null>(null)
  const soundCache = useRef<Map<string, HTMLAudioElement>>(new Map())

  useEffect(() => {
    const savedPreference = localStorage.getItem('audio-enabled')
    if (savedPreference === 'true') {
      setIsAudioEnabled(true)
    }
  }, [])

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const playFallbackTone = useCallback((soundName: string) => {
    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      switch (soundName) {
        case 'paper-rustle':
          oscillator.frequency.setValueAtTime(150, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2)
          gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.2)
          break
        case 'envelope-open':
          oscillator.frequency.setValueAtTime(400, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)
          gainNode.gain.setValueAtTime(0.05, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.3)
          break
        case 'page-turn':
          oscillator.frequency.setValueAtTime(200, ctx.currentTime)
          oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4)
          gainNode.gain.setValueAtTime(0.06, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
          oscillator.start(ctx.currentTime)
          oscillator.stop(ctx.currentTime + 0.4)
          break
      }
    } catch {
      // silently fail
    }
  }, [getAudioContext])

  const playSound = useCallback((soundName: string) => {
    if (!isAudioEnabled) return

    const src = SOUND_FILES[soundName]
    if (src) {
      try {
        let audio = soundCache.current.get(soundName)
        if (!audio) {
          audio = new Audio(src)
          soundCache.current.set(soundName, audio)
        }
        audio.currentTime = 0
        audio.volume = 0.4
        audio.play().catch(() => playFallbackTone(soundName))
        return
      } catch {
        playFallbackTone(soundName)
        return
      }
    }
    playFallbackTone(soundName)
  }, [isAudioEnabled, playFallbackTone])

  const playAmbient = useCallback((soundName: string) => {
    if (!isAudioEnabled) return
    const src = AMBIENT_FILES[soundName]
    if (!src) return

    if (ambientRef.current) {
      ambientRef.current.pause()
      ambientRef.current = null
    }

    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.12
    audio.play().catch(() => {})
    ambientRef.current = audio
  }, [isAudioEnabled])

  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.pause()
      ambientRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isAudioEnabled) {
      stopAmbient()
    }
  }, [isAudioEnabled, stopAmbient])

  const toggleAudio = () => {
    setIsAudioEnabled(prev => {
      const newState = !prev
      localStorage.setItem('audio-enabled', String(newState))
      if (!newState) stopAmbient()
      return newState
    })
  }

  const value: AudioContextType = {
    toggleAudio,
    isAudioEnabled,
    playSound,
    playAmbient,
    stopAmbient,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}
