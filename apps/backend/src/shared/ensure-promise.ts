import { firstValueFrom, Observable } from 'rxjs'

export function ensurePromise<T>(
  result: Observable<T> | Promise<T> | T,
): T | Promise<T> {
  if (result instanceof Observable) {
    return firstValueFrom(result)
  }

  return result
}
