"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { seededValue } from "@/lib/seeded-random"
import { useAudio } from "@/components/audio-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { BIRTHDAY_NUMBER } from "@/lib/birthday"

interface CinematicIntroProps {
  onComplete: () => void
}

const lines = [
  "The projector flickers on...",
  "A story begins...",
  `${BIRTHDAY_NUMBER} years in the making.`,
]

const FILM_SCRATCHES = Array.from({ length: 3 }, (_, i) => ({
  left: `${20 + i * 30}%`,
  repeatDelay: seededValue(i + 1) * 4 + 2,
  delay: i * 1.5,
}))

const DUST_MOTES = Array.from({ length: 8 }, (_, i) => ({
  width: seededValue(i * 6 + 1) * 3 + 1,
  height: seededValue(i * 6 + 2) * 3 + 1,
  left: `${seededValue(i * 6 + 3) * 100}%`,
  xDrift: (seededValue(i * 6 + 4) - 0.5) * 80,
  duration: seededValue(i * 6 + 5) * 8 + 6,
  delay: seededValue(i * 6 + 6) * 5,
}))

function formatTimecode(ms: number) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const f = Math.floor((ms % 1000) / (1000 / 24))
  return [h, m, s, f].map((n) => String(n).padStart(2, "0")).join(":")
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<"black" | "lines" | "title" | "clapper" | "fade">("black")
  const [lineIndex, setLineIndex] = useState(-1)
  const [timecode, setTimecode] = useState("00:00:00:00")
  const [startTime] = useState(() => Date.now())
  const [hasMounted, setHasMounted] = useState(false)
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const { playSound, playAmbient, stopAmbient } = useAudio()
  const hasFinishedRef = useRef(false)

  const finish = useCallback(() => {
    if (hasFinishedRef.current) return
    hasFinishedRef.current = true
    setPhase("clapper")
    playSound("projector-click")
    setTimeout(() => {
      setPhase("fade")
      stopAmbient()
      setTimeout(onComplete, 500)
    }, 600)
  }, [onComplete, playSound, stopAmbient])

  useEffect(() => {
    playAmbient("projector")
    const t0 = setTimeout(() => setPhase("lines"), 800)
    const t1 = setTimeout(() => setLineIndex(0), 1400)
    const t2 = setTimeout(() => setLineIndex(1), 3000)
    const t3 = setTimeout(() => setLineIndex(2), 4600)
    const t4 = setTimeout(() => setPhase("title"), 6400)
    const t5 = setTimeout(() => finish(), 10000)
    return () => {
      ;[t0, t1, t2, t3, t4, t5].forEach(clearTimeout)
      stopAmbient()
    }
  }, [finish, playAmbient, stopAmbient])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimecode(formatTimecode(Date.now() - startTime))
    }, 42)
    return () => clearInterval(interval)
  }, [startTime])

  useEffect(() => {
    const handleKey = () => finish()
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [finish])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const showDust = hasMounted && !reducedMotion && !isMobile

  return (
    <AnimatePresence>
      {phase !== "fade" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-cinema-dark overflow-hidden min-h-dvh"
          onClick={phase === "title" ? finish : undefined}
          role="presentation"
        >
          {/* SMPTE timecode */}
          <div
            className="absolute top-[calc(clamp(2.5rem,4vh,6rem)+0.5rem)] left-4 md:left-8 z-30 font-mono text-[10px] md:text-xs tracking-wider text-cinema-gold/60"
            aria-hidden
          >
            {timecode}
          </div>

          {/* Projector flicker */}
          {!reducedMotion && (
            <motion.div
              className="absolute inset-0 bg-cinema-dark-mid"
              animate={{ opacity: [0, 0.3, 0, 0.15, 0] }}
              transition={{ duration: 0.4, times: [0, 0.2, 0.4, 0.7, 1], repeat: 2, repeatDelay: 5 }}
            />
          )}

          {/* Film reel scratches */}
          {!reducedMotion &&
            FILM_SCRATCHES.map((scratch, i) => (
              <motion.div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-cinema-gold/20"
                style={{ left: scratch.left }}
                animate={{ opacity: [0, 0.8, 0], x: [0, 2, -1, 0] }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  repeatDelay: scratch.repeatDelay,
                  delay: scratch.delay,
                }}
              />
            ))}

          {/* Cinematic letterbox bars */}
          <div
            className="absolute top-0 left-0 right-0 bg-[var(--letterbox)] z-10"
            style={{ height: "clamp(2.5rem, 4vh, 6rem)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--letterbox)] z-10"
            style={{ height: "clamp(2.5rem, 4vh, 6rem)" }}
          />

          {/* Clapperboard overlay */}
          <AnimatePresence>
            {phase === "clapper" && (
              <motion.div
                className="absolute inset-0 z-40 flex items-center justify-center clapper-flash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: "rgba(232, 160, 74, 0.24)" }}
                />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 text-center px-6"
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-cinema-dark/60 mb-2">
                    Scene 01
                  </p>
                  <h2
                    className="text-3xl md:text-5xl font-bold text-cinema-dark"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    The Letters
                  </h2>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Typewriter lines */}
          <AnimatePresence mode="wait">
            {phase === "lines" && (
              <div className="relative z-20 text-center space-y-3 px-6 md:px-8">
                {lines.map((line, i) => (
                  <AnimatePresence key={i}>
                    {lineIndex >= i && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="text-cinema-gold/80 font-serif italic text-base md:text-xl tracking-widest"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {line}
                      </motion.p>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Main title reveal */}
          <AnimatePresence>
            {phase === "title" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-20 text-center px-4 md:px-6 max-w-3xl"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mx-auto mb-6 h-px bg-cinema-gold/50 w-32 md:w-40"
                />
                <motion.p
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "0.3em" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="text-cinema-gold/70 text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4 font-sans"
                >
                  A birthday film — presented for
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-cinema-cream font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {BIRTHDAY_NUMBER} Letters From
                  <br />
                  <span className="text-cinema-gold italic font-normal">Your Loved Ones</span>
                </motion.h1>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="mx-auto mt-6 h-px bg-cinema-gold/50 w-32 md:w-40"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.4 }}
                  className="text-cinema-gold/65 text-xs md:text-sm tracking-widest mt-4 font-sans uppercase"
                >
                  {isMobile ? "Tap anywhere to begin" : "Press any key to begin"}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2 }}
            onClick={(e) => {
              e.stopPropagation()
              finish()
            }}
            className="absolute bottom-[calc(clamp(2.5rem,4vh,6rem)+1rem)] right-4 md:right-8 z-30 text-cinema-gold/65 text-xs uppercase tracking-widest hover:text-cinema-gold transition-colors cursor-pointer min-h-12 min-w-12 flex items-center justify-center"
            aria-label="Skip intro"
          >
            Skip Intro
          </motion.button>

          {/* Floating dust motes — desktop only */}
          {showDust &&
            DUST_MOTES.map((mote, i) => (
              <motion.div
                key={`dust-${i}`}
                className="absolute rounded-full bg-cinema-gold/20"
                style={{
                  width: mote.width,
                  height: mote.height,
                  left: mote.left,
                  bottom: "-10px",
                }}
                animate={{
                  y: [0, -850],
                  x: [0, mote.xDrift],
                  opacity: [0, 0.6, 0.4, 0],
                }}
                transition={{
                  duration: mote.duration,
                  repeat: Infinity,
                  delay: mote.delay,
                  ease: "linear",
                }}
              />
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
