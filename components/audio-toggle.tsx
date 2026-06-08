'use client'

import { useAudio } from '@/components/audio-context'
import { motion } from 'framer-motion'

export function AudioToggle() {
  const { isAudioEnabled, toggleAudio } = useAudio()

  return (
    <motion.button
      onClick={toggleAudio}
      aria-label={isAudioEnabled ? 'Sound on — click to mute' : 'Sound off — click to enable'}
      className="fixed z-[100] flex items-center justify-center gap-2 rounded-full transition-all duration-300 min-w-12 min-h-12"
      style={{
        top: 'max(1rem, env(safe-area-inset-top))',
        right: 'max(1rem, env(safe-area-inset-right))',
        background: isAudioEnabled ? 'rgba(61, 107, 122, 0.35)' : 'rgba(61, 107, 122, 0.22)',
        border: '1px solid rgba(232, 160, 74, 0.45)',
        padding: isAudioEnabled ? '0 14px 0 10px' : undefined,
        width: isAudioEnabled ? 'auto' : 48,
        height: 48,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cinema-gold/80 flex-shrink-0"
      >
        {isAudioEnabled ? (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a6 6 0 0 1 0 8.48M17.69 4.3a10 10 0 0 1 0 15.4" />
          </>
        ) : (
          <>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </>
        )}
      </svg>
      {isAudioEnabled && (
        <span className="text-[10px] uppercase tracking-widest text-cinema-gold/70 pr-1 hidden sm:inline">
          Sound
        </span>
      )}
    </motion.button>
  )
}
