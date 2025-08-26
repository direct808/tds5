export type Nullable<T> = {
  [P in keyof T]: T[P] | undefined | null
}

export type MaybePromise<T> = T | Promise<T>
