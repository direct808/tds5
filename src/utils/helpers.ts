export function arrayUnique<T>(array: Array<T>): Array<T> {
  return Array.from(new Set(array))
}
