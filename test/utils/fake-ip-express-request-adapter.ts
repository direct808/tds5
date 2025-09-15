import { ExpressRequestAdapter } from '@/shared/request-adapter/express-request-adapter'
import { Request } from 'express'

export class FakeIpExpressRequestAdapter extends ExpressRequestAdapter {
  constructor(req: Request, ip: string) {
    super(req)
    this._ip = ip
  }
}
