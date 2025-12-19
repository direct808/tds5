import { Injectable } from '@nestjs/common'
import { RequestAdapter } from '@/shared/request-adapter/request-adapter'
import { ExpressRequestAdapter } from '@/shared/request-adapter/express-request-adapter'
import { Request } from 'express'

@Injectable()
export class RequestAdapterFactory {
  create(request: Request): RequestAdapter {
    return new ExpressRequestAdapter(request)
  }
}
