export function seededValue(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function createSeededParticles(count: number, seedOffset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const base = i * 7 + seedOffset
    return {
      left: `${seededValue(base + 1) * 100}%`,
      top: `${seededValue(base + 2) * 100}%`,
      width: seededValue(base + 3) * 2 + 1,
      height: seededValue(base + 4) * 2 + 1,
      xDrift: (seededValue(base + 5) - 0.5) * 150,
      xIdle: (seededValue(base + 6) - 0.5) * 40,
      duration: seededValue(base + 7) * 10 + 8,
      delay: seededValue(base + 8) * 3,
    }
  })
}
