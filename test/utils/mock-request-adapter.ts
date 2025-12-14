import {
  HeaderName,
  RequestAdapter,
} from '@/shared/request-adapter/request-adapter'

export type MockRequestAdapterData = {
  ip?: string
  headers?: Record<string, string | undefined>
  cookies?: Record<string, string | undefined>
  query?: Record<string, string | undefined>
}

export class MockRequestAdapter implements RequestAdapter {
  public readonly ip = this.data.ip

  static create(data?: MockRequestAdapterData): MockRequestAdapter {
    data = data || {}
    data.query ??= {}

    return new MockRequestAdapter(data)
  }

  private constructor(private readonly data: MockRequestAdapterData) {}

  public query(name: string, value: string): this
  public query(name: string): string | undefined
  public query(name: string, value?: string): string | undefined | this {
    if (!value) {
      return this.data.query?.[name]
    }
    this.data.query![name] = value

    return this
  }

  public queryObject(): object {
    return this.data.query as object
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
