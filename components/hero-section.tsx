"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { useAudio } from "@/components/audio-context"
import { CinemaFrame } from "@/components/cinema-frame"
import { createSeededParticles } from "@/lib/seeded-random"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { BIRTHDAY_ORDINAL } from "@/lib/birthday"

interface HeroSectionProps {
  onStartClick?: () => void
}

const HERO_PARTICLES = createSeededParticles(15, 100)
const FLOATING_CARDS = Array.from({ length: 8 }, (_, i) => ({
  left: `${10 + i * 11}%`,
  top: `${20 + (i % 3) * 20}%`,
  xBurst: (createSeededParticles(1, i + 50)[0].xDrift * 0.6),
  rotation: 45 + i * 10,
}))

export function HeroSection({ onStartClick }: HeroSectionProps) {
  const [isClicked, setIsClicked] = useState(false)
  const { playSound } = useAudio()
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()

  const handleStartClick = async () => {
    setIsClicked(true)
    playSound("paper-rustle")
    await new Promise((resolve) => setTimeout(resolve, 800))
    onStartClick?.()
  }

  return (
    <CinemaFrame
      showLetterbox={false}
      showSprockets={!isMobile}
      fullScreen
      className="overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--cinema-dark) 0%, var(--cinema-dark-mid) 50%, var(--cinema-dark-light) 100%)",
      }}
    >
      <div className="relative h-full w-full">
        {/* Full-viewport backdrop */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="hero-viewport-glow absolute inset-0" />
          <div className="absolute inset-0 lens-flare" />

          {!reducedMotion && (
            <>
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(140vw,72rem)] h-[min(75vh,40rem)] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center top, rgba(232,160,74,0.28) 0%, transparent 72%)",
                }}
                animate={{ opacity: [0.45, 0.75, 0.45] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-[min(55vw,28rem)] h-[min(45vh,24rem)] rounded-full blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(61,107,122,0.18) 0%, transparent 70%)",
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
              />
            </>
          )}
        </div>

        {/* Floating paper letters */}
        {!reducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {FLOATING_CARDS.map((card, i) => (
            <motion.div
              key={i}
              className="absolute opacity-20"
              style={{
                left: card.left,
                top: card.top,
                width: isMobile ? "40px" : "60px",
                height: isMobile ? "54px" : "80px",
                background: "linear-gradient(135deg, var(--cinema-cream) 0%, var(--cinema-paper) 100%)",
                borderRadius: "2px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              animate={{
                y: isClicked ? [0, -400 - i * 50] : [0, 30 + i * 5],
                x: isClicked ? [0, card.xBurst] : 0,
                rotate: isClicked ? [0, card.rotation] : [i * 5, i * 5 + 8],
                opacity: isClicked ? [0.2, 0] : [0.15, 0.25],
                scale: isClicked ? [1, 0.5] : 1,
              }}
              transition={{
                duration: isClicked ? 1 : 4,
                delay: isClicked ? i * 0.08 : i * 0.2,
                repeat: isClicked ? 0 : Infinity,
                repeatType: isClicked ? "play" : "reverse",
                ease: "easeInOut",
              }}
            />
            ))}
          </div>
        )}

        {/* Poster content */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
          <motion.div
            animate={{
              scale: isClicked ? 1.05 : 1,
              y: isClicked ? -60 : 0,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl text-center page-gutters"
          >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-cinema-gold/50 mb-6"
        >
          A Birthday Film
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight mb-4"
          style={{ color: "var(--cinema-cream)", fontFamily: "var(--font-playfair)" }}
        >
          Happy {BIRTHDAY_ORDINAL} Birthday
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-3xl sm:text-4xl md:text-5xl mb-2 text-cinema-gold font-serif italic"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Ojas
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-cinema-gold/60 mb-8"
        >
          Starring Ojas &bull; Directed by the people who love you
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg sm:text-xl md:text-2xl mb-10 md:mb-12 font-light text-cinema-gold"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          Tonight, your memories write back to you.
        </motion.p>

        {/* Play button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleStartClick}
            disabled={isClicked}
            aria-label="Start reading letters"
            className="relative group flex items-center gap-3 mx-auto px-8 md:px-12 py-4 min-h-12 text-sm uppercase tracking-[0.2em] font-sans font-medium cursor-pointer disabled:cursor-not-allowed text-cinema-cream"
            whileHover={!isClicked ? { y: -4 } : {}}
            whileTap={!isClicked ? { scale: 0.98 } : {}}
          >
            <motion.div
              className="absolute inset-0 rounded-sm"
              style={{
                background: "linear-gradient(135deg, rgba(232,160,74,0.26) 0%, rgba(61,107,122,0.18) 100%)",
                border: "2px solid rgba(232,160,74,0.5)",
              }}
              animate={{
                boxShadow: isClicked
                  ? "0 0 0 3px rgba(232,160,74,0.35), 0 0 0 6px rgba(61,107,122,0.2)"
                  : "0 0 0 0px rgba(232,160,74,0.35), 0 0 0 0px rgba(61,107,122,0.2)",
              }}
              transition={{ duration: 0.6 }}
            />
            {isClicked && (
              <motion.div
                className="absolute inset-0 rounded-sm"
                style={{ border: "2px solid rgba(232,160,74,0.85)" }}
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full border border-cinema-gold/50">
                <Play size={14} className="text-cinema-gold ml-0.5" fill="currentColor" />
              </span>
              Play
            </span>
          </motion.button>
          </motion.div>
        </motion.div>

        {/* Tap to begin indicator */}
        {!isClicked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
          >
          <span className="text-[10px] uppercase tracking-widest text-cinema-gold/60">
            {isMobile ? "Tap play to begin" : "Press play to begin"}
          </span>
          <motion.div
            className="w-px h-6 md:h-8 origin-top bg-cinema-gold/30"
            animate={reducedMotion ? {} : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          </motion.div>
        )}

        {/* Particles — desktop only */}
        {!reducedMotion &&
          !isMobile &&
          HERO_PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none bg-cinema-gold/30"
              style={{
                left: p.left,
                top: p.top,
                width: p.width,
                height: p.height,
              }}
              animate={{
                y: isClicked ? [0, -300 - i * 20] : [0, 40 + i * 3],
                x: isClicked ? [0, p.xDrift] : [0, p.xIdle],
                opacity: isClicked ? [0.3, 0] : [0.1, 0.4],
              }}
              transition={{
                duration: isClicked ? 1.2 : p.duration,
                delay: isClicked ? i * 0.05 : p.delay,
                repeat: isClicked ? 0 : Infinity,
                repeatType: isClicked ? "play" : "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
      </div>
    </div>
    </CinemaFrame>
  )
}
