"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { letters, Letter } from "@/lib/letters-data"
import { EnvelopeOpening } from "@/components/envelope-opening"
import { LetterModal } from "@/components/letter-modal"
import { CreditsRoll } from "@/components/credits-roll"
import { useAudio } from "@/components/audio-context"
import { getReadLetterIds, markLetterRead, getReadCount, resetReadProgress } from "@/lib/letter-progress"
import { useIsMobile } from "@/hooks/use-mobile"

export function InboxScreen() {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [showFullLetter, setShowFullLetter] = useState(false)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [readIds, setReadIds] = useState<number[]>([])
  const [showCredits, setShowCredits] = useState(false)
  const { playSound, stopAmbient } = useAudio()
  const isMobile = useIsMobile()

  useEffect(() => {
    stopAmbient()
    setReadIds(getReadLetterIds())
  }, [stopAmbient])

  const sortedLetters = useMemo(
    () => [...letters].sort((a, b) => a.from.localeCompare(b.from)),
    []
  )

  const currentLetterIndex = selectedLetter
    ? sortedLetters.findIndex((l) => l.id === selectedLetter.id)
    : -1

  const handleLetterOpen = useCallback((letter: Letter) => {
    playSound("paper-rustle")
    setShowFullLetter(false)
    setSelectedLetter(letter)
  }, [playSound])

  const handleLetterRead = useCallback((id: number) => {
    const updated = markLetterRead(id)
    setReadIds(updated)
    if (updated.length >= letters.length) {
      setTimeout(() => setShowCredits(true), 1200)
    }
  }, [])

  const handleNextLetter = () => {
    if (currentLetterIndex < sortedLetters.length - 1) {
      setSelectedLetter(sortedLetters[currentLetterIndex + 1])
      setShowFullLetter(false)
    }
  }

  const handlePrevLetter = () => {
    if (currentLetterIndex > 0) {
      setSelectedLetter(sortedLetters[currentLetterIndex - 1])
      setShowFullLetter(false)
    }
  }

  const handleResetProgress = () => {
    resetReadProgress()
    setReadIds([])
    setSelectedLetter(null)
    setShowFullLetter(false)
    setShowCredits(false)
  }

  const readCount = getReadCount(letters.length)
  const progressPct = (readCount / letters.length) * 100

  const renderLetterCard = (letter: Letter, index: number) => {
    const isRead = readIds.includes(letter.id)
    const isHovered = hoveredId === letter.id

    return (
      <motion.div
        key={letter.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => !selectedLetter && setHoveredId(letter.id)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={() => handleLetterOpen(letter)}
        className="group cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={`Open letter from ${letter.from}`}
        onKeyDown={(e) => e.key === "Enter" && handleLetterOpen(letter)}
      >
        <motion.div
          className="relative rounded-sm overflow-hidden border min-h-[120px] md:min-h-[140px]"
          style={{
            borderColor: isHovered ? "rgba(232,160,74,0.45)" : "rgba(61,107,122,0.28)",
            background: isHovered ? "rgba(61,107,122,0.2)" : "rgba(61,107,122,0.12)",
          }}
          animate={{ x: isHovered ? 4 : 0 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3 }}
        >
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: "linear-gradient(90deg, transparent, rgba(232,160,74,0.2), transparent)",
              }}
            />
          )}

          <div className="relative z-10 p-4 md:p-5 flex flex-col h-full">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: letter.waxColor }}
                />
                <span className="text-[10px] uppercase tracking-widest text-cinema-gold/60 truncate">
                  {letter.stampLabel}
                </span>
              </div>
              <motion.div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: isRead ? "transparent" : "var(--cinema-gold)", border: isRead ? "1px solid var(--cinema-gold)" : "none" }}
                animate={{ opacity: isRead ? 0.5 : [1, 0.6] }}
                transition={{ duration: isRead ? 0 : 1.5, repeat: isRead ? 0 : Infinity }}
              />
            </div>

            <h3
              className="text-lg md:text-xl font-semibold truncate mb-1"
              style={{ color: "var(--cinema-cream)", fontFamily: "var(--font-playfair)" }}
            >
              {letter.from}
            </h3>

            <span className="text-[10px] uppercase tracking-widest text-cinema-gold/60 mb-3">
              {letter.relationship}
            </span>

            <p className="text-sm leading-relaxed line-clamp-2 text-cinema-gold/70 flex-1">
              {letter.preview}
            </p>

            {/* Envelope mini */}
            <div className="flex items-center justify-between mt-3">
              <div className="relative w-10 h-7">
                <div
                  className="absolute inset-0 rounded-sm border"
                  style={{ borderColor: "rgba(232,160,74,0.45)", background: "rgba(61,107,122,0.15)" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-sm origin-top"
                  style={{
                    background: letter.waxColor,
                    clipPath: "polygon(0 0, 100% 0, 100% 50%, 50% 75%, 0 50%)",
                  }}
                  animate={{ rotateX: isHovered ? 120 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-cinema-gold/65 text-sm">→</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  if (showCredits) {
    return <CreditsRoll onClose={() => setShowCredits(false)} />
  }

  return (
    <>
      <section
        className="relative min-h-dvh pb-24"
        style={{ background: "linear-gradient(180deg, var(--cinema-dark) 0%, var(--cinema-dark-mid) 100%)" }}
      >
        <AnimatePresence>
          {selectedLetter && (
            <motion.div
              className="fixed inset-0 z-30 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: "radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)",
                backdropFilter: "blur(4px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Header + progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 pt-8 md:pt-12 page-gutters mb-8"
          style={{ paddingTop: "max(2rem, env(safe-area-inset-top))" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="mb-3 flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-cinema-gold/60">
                Scene 02 — The Dailies
              </p>
              <button
                onClick={handleResetProgress}
                className="text-[10px] uppercase tracking-[0.2em] text-cinema-gold/35 hover:text-cinema-gold/75 underline underline-offset-2 transition-colors cursor-pointer"
              >
                reset progress
              </button>
            </div>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight mb-3"
              style={{ color: "var(--cinema-cream)", fontFamily: "var(--font-playfair)" }}
            >
              Your Inbox
            </h1>
            <p className="text-sm md:text-base text-cinema-gold/80 mb-6">
              {letters.length} letters from people who love you.
            </p>

            {/* Progress bar */}
            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-cinema-gold/60">
              <span>{readCount} of {letters.length} opened</span>
              <button
                onClick={() => setShowCredits(true)}
                className="hover:text-cinema-gold transition-colors cursor-pointer"
              >
                View credits
              </button>
            </div>
            <div className="h-1 rounded-full bg-cinema-gold/10 overflow-hidden">
              <motion.div
                className="h-full bg-cinema-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>

        {/* Letter grid */}
        <motion.div
          className="relative z-10 max-w-6xl mx-auto page-gutters"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {sortedLetters.map((letter, i) => renderLetterCard(letter, i))}
          </div>

          <motion.p
            className="text-center text-xs text-cinema-gold/65 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {isMobile ? "Tap a letter to open it" : "Click any letter to read it in full"}
          </motion.p>
        </motion.div>
      </section>

      <AnimatePresence mode="wait">
        {selectedLetter && !showFullLetter && (
          <EnvelopeOpening
            key={`envelope-${selectedLetter.id}`}
            letter={selectedLetter}
            onComplete={() => {
              setShowFullLetter(true)
              handleLetterRead(selectedLetter.id)
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLetter && showFullLetter && (
          <LetterModal
            key={`letter-${selectedLetter.id}`}
            letter={selectedLetter}
            letterIndex={currentLetterIndex}
            totalLetters={sortedLetters.length}
            onClose={() => {
              setSelectedLetter(null)
              setShowFullLetter(false)
            }}
            onNextLetter={currentLetterIndex < sortedLetters.length - 1 ? handleNextLetter : undefined}
            onPrevLetter={currentLetterIndex > 0 ? handlePrevLetter : undefined}
          />
        )}
      </AnimatePresence>
    </>
  )
}
