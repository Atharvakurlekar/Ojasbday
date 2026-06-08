"use client"

import { motion } from "framer-motion"
import { BIRTHDAY_NUMBER } from "@/lib/birthday"

export function CinematicFooter() {
  return (
    <footer
        className="relative py-16 md:py-20 page-gutters text-center overflow-hidden"
        style={{
          background: "linear-gradient(0deg, var(--cinema-dark) 0%, var(--cinema-dark-mid) 100%)",
        }}
      >
        <div className="absolute left-0 right-0 top-0 flex gap-3 md:gap-4 px-4 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex-1 h-2.5 md:h-3 border border-cinema-gold/10 rounded-sm" />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-lg mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
            <div className="flex-1 max-w-[60px] h-px bg-cinema-gold/30" />
            <span className="text-cinema-gold/50 text-sm">✦</span>
            <div className="flex-1 max-w-[60px] h-px bg-cinema-gold/30" />
          </div>

          <p
            className="font-handwriting text-2xl md:text-4xl mb-4 text-cinema-gold"
            style={{ fontFamily: "var(--font-dancing)" }}
          >
            With love, always.
          </p>

          <p
            className="font-serif italic text-base md:text-lg mb-2 text-cinema-gold/60"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            &ldquo;The film of your life has only just begun — roll camera.&rdquo;
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 md:mt-8">
            <div className="flex-1 max-w-[60px] h-px bg-cinema-gold/20" />
            <p className="text-[10px] uppercase tracking-[0.35em] text-cinema-gold/60">
              {BIRTHDAY_NUMBER} &bull; A Birthday Film &bull; 2026
            </p>
            <div className="flex-1 max-w-[60px] h-px bg-cinema-gold/20" />
          </div>
        </motion.div>

        <div className="absolute left-0 right-0 bottom-0 flex gap-3 md:gap-4 px-4 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex-1 h-2.5 md:h-3 border border-cinema-gold/10 rounded-sm" />
          ))}
        </div>
    </footer>
  )
}
