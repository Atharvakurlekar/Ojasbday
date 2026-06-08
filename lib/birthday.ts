export const RECIPIENT_NAME = "Ojas"

/**
 * Single source of truth for the birthday number used across the site.
 * Update this one value to refresh all "22/22nd" copy everywhere.
 */
export const BIRTHDAY_NUMBER = 22

export function ordinalize(n: number) {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`

  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

export const BIRTHDAY_ORDINAL = ordinalize(BIRTHDAY_NUMBER)

