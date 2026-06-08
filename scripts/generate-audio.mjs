import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, "../public/audio")

function writeWav(filename, durationSec, fn) {
  const sampleRate = 22050
  const numSamples = Math.floor(sampleRate * durationSec)
  const buffer = Buffer.alloc(44 + numSamples * 2)

  buffer.write("RIFF", 0)
  buffer.writeUInt32LE(36 + numSamples * 2, 4)
  buffer.write("WAVE", 8)
  buffer.write("fmt ", 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write("data", 36)
  buffer.writeUInt32LE(numSamples * 2, 40)

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate
    const sample = Math.max(-1, Math.min(1, fn(t, i, numSamples)))
    buffer.writeInt16LE(Math.floor(sample * 32767 * 0.3), 44 + i * 2)
  }

  fs.writeFileSync(path.join(outDir, filename), buffer)
}

fs.mkdirSync(outDir, { recursive: true })

writeWav("paper-rustle.wav", 0.25, (t) => {
  const noise = (Math.random() * 2 - 1) * Math.exp(-t * 12)
  return noise * Math.sin(t * 400)
})

writeWav("envelope-tear.wav", 0.35, (t) => {
  const noise = (Math.random() * 2 - 1) * 0.6
  return noise * Math.sin(t * 300 + t * t * 200) * Math.exp(-t * 6)
})

writeWav("page-turn.wav", 0.4, (t) => {
  const sweep = Math.sin(t * 150 + t * t * 400) * Math.exp(-t * 5)
  return sweep + (Math.random() * 2 - 1) * 0.1 * Math.exp(-t * 8)
})

writeWav("projector-click.wav", 0.15, (t) => {
  return Math.sin(t * 800) * Math.exp(-t * 30) + (Math.random() * 2 - 1) * 0.2 * Math.exp(-t * 20)
})

// Loopable projector hum (~2s)
writeWav("projector-hum.wav", 2.0, (t) => {
  return (
    Math.sin(t * 60) * 0.3 +
    Math.sin(t * 120) * 0.15 +
    (Math.random() * 2 - 1) * 0.05
  )
})

console.log("Generated audio files in public/audio/")
