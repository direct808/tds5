import { HeaderName, RequestAdapter } from './request-adapter'

export type MockRequestAdapterData = {
  ip?: string
  headers?: Record<string, string | undefined>
  cookies?: Record<string, string | undefined>
  query?: Record<string, string | undefined>
}

export class MockRequestAdapter implements RequestAdapter {
  public readonly ip = this.data.ip

  constructor(private readonly data: MockRequestAdapterData) {}

  public query(name: string): string | undefined {
    return this.data.query?.[name]
  }

  public cookie(name: string): string | undefined {
    return this.data.cookies?.[name]
  }

  public header(name: HeaderName): string | undefined {
    return this.data.headers?.[name]
  }
}
