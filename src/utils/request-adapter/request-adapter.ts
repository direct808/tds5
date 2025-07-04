export type HeaderName = 'accept-language' | 'referer' | 'user-agent'

export interface RequestAdapter {
  ip: string | undefined

  query(name: string): string | undefined

  cookie(name: string): string | undefined

  header(name: HeaderName): string | undefined
}
