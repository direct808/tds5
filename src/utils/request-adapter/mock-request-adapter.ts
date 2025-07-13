import { HeaderName, RequestAdapter } from './request-adapter.js'

export type MockRequestAdapterData = {
  ip?: string
  headers?: Record<string, string | undefined>
  cookies?: Record<string, string | undefined>
  query?: Record<string, string | undefined>
}

export class MockRequestAdapter implements RequestAdapter {
  public readonly ip: string | undefined

  static create(data?: MockRequestAdapterData) {
    data = data || {}
    return new MockRequestAdapter(data)
  }

  private constructor(private readonly data: MockRequestAdapterData) {
    this.ip = this.data.ip
  }

  public query(name: string): string | undefined {
    return this.data.query?.[name]
  }

  public cookie(name: string): string | undefined {
    return this.data.cookies?.[name]
  }

  public header(name: HeaderName): string | undefined {
    return this.data.headers?.[name]
  }

  public setHeader(name: HeaderName, value: string): this {
    this.data.headers = this.data.headers || {}
    this.data.headers[name] = value
    return this
  }
}
