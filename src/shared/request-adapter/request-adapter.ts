export type HeaderName = 'accept-language' | 'referer' | 'user-agent'

export interface RequestAdapter {
  ip: string | undefined

  query(name: string): string | undefined

  queryObject(): object

  cookie(name: string): string | undefined

  header(name: HeaderName): string | undefined

  domain(): string | undefined
}
