import { Injectable } from '@nestjs/common'
import { RequestAdapter } from './request-adapter'
import { ExpressRequestAdapter } from './express-request-adapter'
import { Request } from 'express'

@Injectable()
export class RequestAdapterFactory {
  create(request: Request): RequestAdapter {
    return new ExpressRequestAdapter(request)
  }
}
