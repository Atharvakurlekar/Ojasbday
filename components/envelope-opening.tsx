"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Letter } from "@/lib/letters-data"
import { useAudio } from "@/components/audio-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface EnvelopeOpeningProps {
  letter: Letter
  onComplete: () => void
}

export function EnvelopeOpening({ letter, onComplete }: EnvelopeOpeningProps) {
  const [phase, setPhase] = useState<"idle" | "breaking" | "opening">("idle")
  const { playSound } = useAudio()
  const reducedMotion = useReducedMotion()

  const handleClick = () => {
    if (phase !== "idle") return
    playSound("envelope-open")
    setPhase("breaking")
    setTimeout(() => setPhase("opening"), 700)
    setTimeout(() => onComplete(), 1600)
  }

  const initial = letter.from.charAt(0).toUpperCase()

  const particles = [
    { x: -80, y: -90, r: 0 },
    { x: 60, y: -100, r: 45 },
    { x: 110, y: -30, r: 20 },
    { x: 90, y: 70, r: -30 },
    { x: 10, y: 110, r: 60 },
    { x: -70, y: 100, r: -45 },
    { x: -110, y: 20, r: 15 },
    { x: -50, y: -60, r: -20 },
    { x: 50, y: -50, r: 90 },
    { x: 30, y: 80, r: -60 },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-dvh px-4"
      style={{
        background: "rgba(6, 10, 15, 0.96)",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleClick}
      role="button"
      aria-label={`Open letter from ${letter.from}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: "min(500px, 90vw)",
          height: "min(400px, 60vh)",
          background: "radial-gradient(ellipse, rgba(61,107,122,0.2) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative cursor-pointer select-none w-full max-w-[400px]"
        initial={{ opacity: 0, y: 50, scale: 0.92 }}
        animate={{
          opacity: phase === "opening" ? 0 : 1,
          y: phase === "opening" ? -80 : 0,
          scale: phase === "opening" ? 0.88 : 1,
        }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="relative rounded-sm overflow-hidden w-full"
          style={{
            aspectRatio: "10 / 7",
            background: "linear-gradient(170deg, var(--cinema-paper) 0%, color-mix(in oklab, var(--cinema-paper) 75%, var(--cinema-cream) 25%) 40%, var(--cinema-cream) 100%)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='t'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23t)' opacity='0.07'/%3E%3C/svg%3E")`,
            }}
          />

          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 280" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="200" y2="140" stroke="var(--cinema-label)" strokeWidth="0.8" opacity="0.35" />
            <line x1="400" y1="0" x2="200" y2="140" stroke="var(--cinema-label)" strokeWidth="0.8" opacity="0.35" />
            <line x1="0" y1="280" x2="200" y2="140" stroke="var(--cinema-label)" strokeWidth="0.8" opacity="0.25" />
            <line x1="400" y1="280" x2="200" y2="140" stroke="var(--cinema-label)" strokeWidth="0.8" opacity="0.25" />
          </svg>

          {/* Crack lines before break */}
          <AnimatePresence>
            {phase === "breaking" && (
              <>
                <motion.div
                  className="absolute left-1/2 top-1/2 w-16 h-px bg-red-900/40 origin-center"
                  initial={{ scaleX: 0, rotate: -30 }}
                  animate={{ scaleX: 1 }}
                  style={{ marginLeft: -32, marginTop: -20 }}
                />
                <motion.div
                  className="absolute left-1/2 top-1/2 w-12 h-px bg-red-900/30 origin-center"
                  initial={{ scaleX: 0, rotate: 45 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.05 }}
                  style={{ marginLeft: -24, marginTop: 10 }}
                />
              </>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative" style={{ width: 88, height: 88 }}>
              <AnimatePresence>
                {phase !== "idle" &&
                  particles.map((p, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: 8 + (i % 3) * 4,
                        height: 8 + (i % 3) * 4,
                        background: i % 2 === 0 ? "var(--cinema-burgundy)" : "var(--cinema-gold)",
                        left: "50%",
                        top: "50%",
                        marginLeft: -4,
                        marginTop: -4,
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2, rotate: p.r }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.025 }}
                    />
                  ))}
              </AnimatePresence>

              {/* Touch-friendly hit area */}
              <div className="absolute -inset-4 md:-inset-2" />

              <motion.div
                className={`absolute inset-0 rounded-full ${phase === "idle" && !reducedMotion ? "seal-pulse" : ""}`}
                style={{
                  background: "radial-gradient(circle at 38% 32%, color-mix(in oklab, var(--cinema-gold) 25%, white 75%) 0%, color-mix(in oklab, var(--cinema-burgundy) 70%, black 30%) 35%, color-mix(in oklab, var(--cinema-burgundy) 90%, black 10%) 100%)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.55), inset -3px -4px 10px rgba(0,0,0,0.45)",
                }}
                animate={phase !== "idle" ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: phase !== "idle" ? 0.1 : 0 }}
              >
                <div
                  className="absolute rounded-full"
                  style={{ inset: 9, border: "1px solid rgba(232,160,74,0.25)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-bold text-2xl md:text-[26px]"
                    style={{
                      color: "rgba(10, 18, 24, 0.78)",
                      fontFamily: "var(--font-playfair)",
                    }}
                  >
                    {initial}
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div className="flex flex-col items-center mt-4 md:mt-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <h2
                className="text-2xl md:text-[32px] leading-none"
                style={{ fontFamily: "var(--font-dancing)", color: "var(--cinema-label)" }}
              >
                {letter.from}
              </h2>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-cinema-label/70">
                {letter.relationship}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute flex flex-col items-center gap-3"
        style={{ bottom: "max(4rem, calc(env(safe-area-inset-bottom) + 3rem))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "idle" ? 1 : 0 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-cinema-gold/55">
          Tap to break the seal
        </p>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(232,160,74,0.65)"
          strokeWidth="1.5"
          animate={reducedMotion ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </motion.svg>
      </motion.div>
    </motion.div>
  )
}
