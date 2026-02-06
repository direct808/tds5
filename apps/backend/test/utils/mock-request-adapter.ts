import {
  HeaderName,
  RequestAdapter,
} from '../../src/shared/request-adapter/request-adapter'

export type MockRequestAdapterData = {
  ip?: string
  domain?: string
  headers?: Record<string, string | undefined>
  cookies?: Record<string, string | undefined>
  query: Record<string, string | undefined>
}

export class MockRequestAdapter implements RequestAdapter {
  public readonly ip = this.data.ip

  static create(data?: MockRequestAdapterData): MockRequestAdapter {
    data = data || { query: {} }

    return new MockRequestAdapter(data)
  }

  private constructor(private readonly data: MockRequestAdapterData) {}

  public query: RequestAdapter['query'] = (name) => {
    return this.data.query?.[name]
  }

  public queryObject: RequestAdapter['queryObject'] = () => {
    return this.data.query as object
  }

  public cookie: RequestAdapter['cookie'] = (name) => {
    return this.data.cookies?.[name]
  }

  public header: RequestAdapter['header'] = (name) => {
    return this.data.headers?.[name]
  }

  public domain: RequestAdapter['domain'] = () => {
    return this.data.domain
  }

  public setHeader(name: HeaderName, value: string): this {
    this.data.headers = this.data.headers || {}
    this.data.headers[name] = value

    return this
  }

  public setQuery(name: string, value: string): this {
    this.data.query[name] = value

    return this
  }
}
