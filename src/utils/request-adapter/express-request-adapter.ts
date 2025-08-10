import { Request } from 'express'
import { HeaderName, RequestAdapter } from './request-adapter'

export class ExpressRequestAdapter implements RequestAdapter {
  protected _ip = this.req.ip

  constructor(protected readonly req: Request) {}

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

  get ip(): string | undefined {
    return this._ip
  }
}
