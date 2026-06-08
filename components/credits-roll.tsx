"use client"

import { motion } from "framer-motion"
import { letters } from "@/lib/letters-data"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { BIRTHDAY_NUMBER } from "@/lib/birthday"

interface CreditsRollProps {
  onClose?: () => void
}

export function CreditsRoll({ onClose }: CreditsRollProps) {
  const reducedMotion = useReducedMotion()
  const cast = [...letters]
    .sort((a, b) => a.from.localeCompare(b.from))
    .map((l) => ({ name: l.from, role: l.relationship }))

  return (
    <section
      className="relative overflow-hidden py-20 page-gutters text-center"
      style={{ background: "linear-gradient(0deg, var(--cinema-dark) 0%, var(--cinema-dark-mid) 100%)" }}
    >
      <div className="absolute left-0 right-0 top-0 flex gap-3 px-4 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 h-2.5 border border-cinema-gold/10 rounded-sm" />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-lg mx-auto"
      >
        <p className="text-[10px] uppercase tracking-[0.4em] text-cinema-gold/60 mb-8">
          Cast &amp; Crew
        </p>

        <div
          className={`space-y-4 ${reducedMotion ? "" : "credits-scroll"}`}
          style={{ maxHeight: reducedMotion ? "none" : "280px", overflow: reducedMotion ? "visible" : "hidden" }}
        >
          <div className={reducedMotion ? "space-y-4" : "credits-scroll-inner"}>
            {cast.map((person) => (
              <div key={person.name}>
                <p
                  className="text-xl md:text-2xl"
                  style={{ color: "var(--cinema-cream)", fontFamily: "var(--font-playfair)" }}
                >
                  {person.name}
                </p>
                <p className="text-xs uppercase tracking-widest text-cinema-gold/50 mt-1">
                  {person.role}
                </p>
              </div>
            ))}
            <div className="pt-8 pb-4">
              <p
                className="font-handwriting text-2xl md:text-3xl text-cinema-gold"
                style={{ fontFamily: "var(--font-dancing)" }}
              >
                Starring Ojas
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-cinema-gold/60 mt-3">
                Directed by the people who love you
              </p>
            </div>
          </div>
        </div>

        <p
          className="font-serif italic text-base md:text-lg mt-10 text-cinema-gold/60"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          &ldquo;The film of your life has only just begun — roll camera.&rdquo;
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex-1 max-w-[60px] h-px bg-cinema-gold/20" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-cinema-gold/60">
            {BIRTHDAY_NUMBER} &bull; A Birthday Film &bull; 2026
          </p>
          <div className="flex-1 max-w-[60px] h-px bg-cinema-gold/20" />
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-8 text-xs uppercase tracking-widest text-cinema-gold/50 hover:text-cinema-gold transition-colors cursor-pointer"
          >
            Back to inbox
          </button>
        )}
      </motion.div>
    </section>
  )
}
