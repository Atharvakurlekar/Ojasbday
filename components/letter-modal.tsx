"use client"

import { motion } from "framer-motion"
import { Letter } from "@/lib/letters-data"
import { useEffect, useState } from "react"
import { ChevronRight, ChevronLeft, X, Home } from "lucide-react"
import { useAudio } from "@/components/audio-context"
import { useIsMobile } from "@/hooks/use-mobile"
import Image from "next/image"

interface LetterModalProps {
  letter: Letter
  letterIndex?: number
  totalLetters?: number
  onClose: () => void
  onNextLetter?: () => void
  onPrevLetter?: () => void
}

export function LetterModal({
  letter,
  letterIndex = 0,
  totalLetters = 20,
  onClose,
  onNextLetter,
  onPrevLetter,
}: LetterModalProps) {
  const [scrolled, setScrolled] = useState(false)
  const { playSound } = useAudio()
  const isMobile = useIsMobile()

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && onNextLetter) {
        playSound("page-turn")
        onNextLetter()
      }
      if (e.key === "ArrowLeft" && onPrevLetter) {
        playSound("page-turn")
        onPrevLetter()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onNextLetter, onPrevLetter, playSound])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 30)
  }

  const slugLine = `INT. LETTER FROM ${letter.from.toUpperCase()} — DAY`

  const NavBar = () => (
    <div className="flex items-center justify-between gap-4 w-full">
      <motion.button
        onClick={() => {
          playSound("page-turn")
          onPrevLetter?.()
        }}
        disabled={!onPrevLetter}
        aria-label="Previous letter"
        className="flex items-center justify-center min-w-12 min-h-12 p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "rgba(247,243,237,0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(61,107,122,0.25)",
        }}
        whileTap={onPrevLetter ? { scale: 0.95 } : {}}
      >
        <ChevronLeft size={22} style={{ color: "var(--cinema-dark)" }} />
      </motion.button>

      <motion.button
        onClick={onClose}
        aria-label="Close letter"
        className="flex items-center justify-center min-w-12 min-h-12 p-3 rounded-full"
        style={{
          backgroundColor: "rgba(247,243,237,0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(61,107,122,0.25)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Home size={20} style={{ color: "var(--cinema-dark)" }} />
      </motion.button>

      <motion.button
        onClick={() => {
          playSound("page-turn")
          onNextLetter?.()
        }}
        disabled={!onNextLetter}
        aria-label="Next letter"
        className="flex items-center justify-center min-w-12 min-h-12 p-3 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "rgba(247,243,237,0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(61,107,122,0.25)",
        }}
        whileTap={onNextLetter ? { scale: 0.95 } : {}}
      >
        <ChevronRight size={22} style={{ color: "var(--cinema-dark)" }} />
      </motion.button>
    </div>
  )

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden min-h-dvh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 15%, rgba(232,160,74,0.18) 0%, transparent 45%), radial-gradient(ellipse at 82% 88%, rgba(61,107,122,0.12) 0%, transparent 52%), linear-gradient(135deg, color-mix(in oklab, var(--cinema-paper) 78%, #d8c5a7 22%) 0%, color-mix(in oklab, var(--cinema-paper) 88%, #c7a77e 12%) 55%, color-mix(in oklab, var(--cinema-paper) 76%, #b1885c 24%) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 22% 28%, rgba(110, 70, 30, 0.08) 0%, transparent 16%),
              radial-gradient(circle at 82% 15%, rgba(120, 85, 35, 0.07) 0%, transparent 14%),
              radial-gradient(circle at 74% 80%, rgba(80, 55, 28, 0.08) 0%, transparent 18%),
              repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(61,107,122,0.04) 3px, rgba(61,107,122,0.04) 5px),
              repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(232,160,74,0.04) 3px, rgba(232,160,74,0.04) 5px)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.12) 100%)",
          }}
        />
      </div>

      {/* Top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 px-4 md:px-8 pt-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center min-w-12 min-h-12 p-2 rounded-full"
            style={{
              backgroundColor: "rgba(247,243,237,0.85)",
              border: "1px solid rgba(61,107,122,0.25)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={22} style={{ color: "var(--cinema-dark)" }} />
          </motion.button>

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cinema-label/75">
              {letter.stampLabel} &bull; {letterIndex + 1} / {totalLetters}
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-cinema-label/65 mt-1 hidden sm:block">
              {slugLine}
            </p>
          </div>

          <div className="w-12" />
        </div>
      </motion.div>

      {/* Letter paper */}
      <div className="relative w-full h-full flex items-center justify-center px-3 sm:px-6 md:px-8 pt-16 pb-28 md:pb-8 overflow-hidden">
        <motion.div
          className="relative w-full max-w-2xl h-full md:h-auto md:max-h-[85vh] flex flex-col shadow-2xl paper-texture"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            background:
              "linear-gradient(168deg, color-mix(in oklab, var(--cinema-paper) 73%, #fef8eb 27%) 0%, color-mix(in oklab, var(--cinema-paper) 88%, #e5cfaf 12%) 35%, color-mix(in oklab, var(--cinema-paper) 78%, #d0b088 22%) 100%)",
            boxShadow: "0 30px 60px rgba(30, 20, 10, 0.38), 0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.5)",
            border: "1px solid rgba(120, 88, 50, 0.25)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(178deg, rgba(255,255,255,0.2) 0%, transparent 24%, rgba(90, 60, 28, 0.08) 100%)",
            }}
          />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/5 to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-black/3 to-transparent" />

          <div
            className="relative z-10 flex-1 overflow-y-auto px-5 sm:px-8 md:px-16 py-8 md:py-12 overscroll-contain"
            onScroll={handleScroll}
          >
            {/* Script slug — mobile */}
            <p className="text-[10px] uppercase tracking-[0.15em] text-cinema-label/65 mb-6 sm:hidden">
              {slugLine}
            </p>

            <motion.div
              className="mb-8 md:mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] mb-3 text-cinema-label">
                {letter.relationship}
              </p>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                style={{ color: "var(--cinema-dark)", fontFamily: "var(--font-playfair)" }}
              >
                {letter.from}
              </h1>
            </motion.div>

            {letter.imageUrl ? (
              <motion.div
                className="flex flex-col items-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-cinema-label/75 mb-4">
                  Archival Footage
                </p>
                <div
                  className="relative p-3 pb-10 bg-white shadow-xl max-w-md w-full"
                  style={{
                    boxShadow: "0 15px 35px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
                    transform: "rotate(-1deg)",
                  }}
                >
                  <Image
                    src={letter.imageUrl}
                    alt={`Handwritten letter from ${letter.from}`}
                    width={600}
                    height={800}
                    className="w-full h-auto rounded-sm"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                  <p
                    className="absolute bottom-3 left-0 right-0 text-center text-sm text-cinema-label/80"
                    style={{ fontFamily: "var(--font-dancing)" }}
                  >
                    {letter.from}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-5 md:space-y-7"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {letter.fullText?.split("\n\n").map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: "var(--cinema-ink)", fontFamily: "var(--font-lato)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.06 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
            )}

            {!letter.imageUrl && (
              <motion.div
                className="mt-10 md:mt-14 pt-8 border-t border-black/8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p
                  className="italic text-base md:text-lg text-cinema-label"
                  style={{ fontFamily: "var(--font-dancing)" }}
                >
                  With love,
                </p>
                <p
                  className="text-xl md:text-2xl font-semibold mt-2"
                  style={{ color: "var(--cinema-dark)", fontFamily: "var(--font-playfair)" }}
                >
                  {letter.from}
                </p>
              </motion.div>
            )}

            <div className="h-8" />
          </div>

          {!scrolled && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--cinema-paper)] to-transparent pointer-events-none md:hidden"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Desktop side nav */}
        {!isMobile && (
          <>
            <motion.button
              onClick={() => { playSound("page-turn"); onPrevLetter?.() }}
              disabled={!onPrevLetter}
              aria-label="Previous letter"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full disabled:opacity-20"
              style={{ backgroundColor: "rgba(247,243,237,0.82)", border: "1px solid rgba(61,107,122,0.25)" }}
              whileHover={onPrevLetter ? { scale: 1.05 } : {}}
            >
              <ChevronLeft size={24} style={{ color: "var(--cinema-dark)" }} />
            </motion.button>
            <motion.button
              onClick={() => { playSound("page-turn"); onNextLetter?.() }}
              disabled={!onNextLetter}
              aria-label="Next letter"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full disabled:opacity-20"
              style={{ backgroundColor: "rgba(247,243,237,0.82)", border: "1px solid rgba(61,107,122,0.25)" }}
              whileHover={onNextLetter ? { scale: 1.05 } : {}}
            >
              <ChevronRight size={24} style={{ color: "var(--cinema-dark)" }} />
            </motion.button>
          </>
        )}
      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              backgroundColor: "rgba(247,243,237,0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(61,107,122,0.25)",
            }}
          >
            <NavBar />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
