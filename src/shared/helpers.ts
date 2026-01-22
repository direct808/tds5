export function arrayUnique<T>(array: Array<T>): Array<T> {
  return Array.from(new Set(array))
}

export function filterNotNullable<T>(
  items: (T | null | undefined | '')[],
): T[] {
  return items.filter((item): item is T => Boolean(item))
}
