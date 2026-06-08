"use client"

import { ReactNode } from "react"

interface CinemaFrameProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  showLetterbox?: boolean
  showSprockets?: boolean
  fullScreen?: boolean
}

export function CinemaFrame({
  children,
  className = "",
  style,
  showLetterbox = true,
  showSprockets = false,
  fullScreen = false,
}: CinemaFrameProps) {
  return (
    <div
      className={`relative w-full ${
        fullScreen ? "h-svh min-h-svh" : "min-h-screen"
      } ${className}`}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        ...style,
      }}
    >
      {showLetterbox && (
        <>
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 z-20 bg-cinema-dark"
            style={{ height: "clamp(2.5rem, 4vh, 6rem)" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 bg-cinema-dark"
            style={{ height: "clamp(2.5rem, 4vh, 6rem)" }}
          />
        </>
      )}

      {showSprockets && (
        <>
          <div className="pointer-events-none absolute left-2 md:left-4 top-0 bottom-0 z-10 hidden sm:flex flex-col justify-evenly gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`l-${i}`}
                className="h-3 w-2.5 md:h-4 md:w-3 rounded-sm border border-cinema-gold/10"
              />
            ))}
          </div>
          <div className="pointer-events-none absolute right-2 md:right-4 top-0 bottom-0 z-10 hidden sm:flex flex-col justify-evenly gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`r-${i}`}
                className="h-3 w-2.5 md:h-4 md:w-3 rounded-sm border border-cinema-gold/10"
              />
            ))}
          </div>
        </>
      )}

      <div
        className={
          fullScreen
            ? "absolute inset-0 z-10 h-full w-full"
            : "relative z-10"
        }
      >
        {children}
      </div>
    </div>
  )
}
