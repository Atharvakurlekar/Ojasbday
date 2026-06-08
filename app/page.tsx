"use client"

import { useState } from "react"
import { CinematicIntro } from "@/components/cinematic-intro"
import { HeroSection } from "@/components/hero-section"
import { InboxScreen } from "@/components/inbox-screen"
import { CinematicFooter } from "@/components/cinematic-footer"
import { CursorSpotlight } from "@/components/cursor-spotlight"
import { motion, AnimatePresence } from "framer-motion"

export const dynamic = "force-dynamic"

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false)
  const [showInbox, setShowInbox] = useState(false)
  const [filmBurn, setFilmBurn] = useState(false)

  const handleStartClick = () => {
    setFilmBurn(true)
    setTimeout(() => {
      setShowInbox(true)
      setFilmBurn(false)
    }, 700)
  }

  return (
    <>
      <CursorSpotlight />

      {!introComplete && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}

      {filmBurn && <div className="film-burn-overlay film-burn-enter" aria-hidden />}

      <AnimatePresence mode="wait">
        {introComplete && (
          <motion.main
            key={showInbox ? "inbox" : "hero"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-svh w-full"
          >
            {!showInbox ? (
              <>
                <HeroSection onStartClick={handleStartClick} />
                <CinematicFooter />
              </>
            ) : (
              <InboxScreen />
            )}
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
