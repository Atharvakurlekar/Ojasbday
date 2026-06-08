const STORAGE_KEY = "letters-read"

export function getReadLetterIds(): number[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

export function markLetterRead(id: number): number[] {
  const current = getReadLetterIds()
  if (current.includes(id)) return current
  const updated = [...current, id]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function getReadCount(total: number): number {
  const read = getReadLetterIds()
  return read.filter((id) => id <= total).length
}

export function resetReadProgress() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
