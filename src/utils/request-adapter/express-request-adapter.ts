import { Request } from 'express'
import { HeaderName, RequestAdapter } from './request-adapter.js'

export class ExpressRequestAdapter implements RequestAdapter {
  public readonly ip: string | undefined

  constructor(private readonly req: Request) {
    this.ip = this.req.ip
  }

  public query(name: string): string | undefined {
    const result = this.req.query[name]
    if (typeof result === 'string') {
      return result
    }
  }

  public cookie(name: string): string | undefined {
    return this.req.cookies[name]
  }

  public header(name: HeaderName): string | undefined {
    return this.req.header(name)
  }
}
