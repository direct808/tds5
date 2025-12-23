import type { Request } from 'express'
import type { RequestAdapter } from './request-adapter'

export class ExpressRequestAdapter implements RequestAdapter {
  protected _ip = this.req.ip

  constructor(protected readonly req: Request) {}

  public query: RequestAdapter['query'] = (name) => {
    const result = this.req.query[name]
    if (typeof result === 'string') {
      return result
    }
  }

  public queryObject: RequestAdapter['queryObject'] = () => {
    return this.req.query
  }

  public cookie: RequestAdapter['cookie'] = (name) => {
    return this.req.cookies[name]
  }

  public header: RequestAdapter['header'] = (name) => {
    return this.req.header(name)
  }

  get ip(): string | undefined {
    return this._ip
  }

  public domain: RequestAdapter['domain'] = () => {
    return this.req.hostname
  }
}
