"use client"

import { useEffect, useState } from "react"

export function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    if (!isFinePointer) return

    document.body.classList.add("spotlight-cursor")

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    return () => {
      document.body.classList.remove("spotlight-cursor")
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="cursor-spotlight"
      style={{ left: pos.x, top: pos.y }}
      aria-hidden
    />
  )
}
