export function arrayUnique<T>(array: Array<T>): Array<T> {
  return Array.from(new Set(array))
}

export function ensureDefined<T>(value: T | undefined): T {
  if (typeof value === 'undefined') {
    throw new Error('Value is undefined')
  }

  return value
}
