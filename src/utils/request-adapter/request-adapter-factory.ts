import { Injectable } from '@nestjs/common'
import { RequestAdapter } from '@/utils/request-adapter/request-adapter'
import { ExpressRequestAdapter } from '@/utils/request-adapter/express-request-adapter'
import { Request } from 'express'

@Injectable()
export class RequestAdapterFactory {
  create(request: Request): RequestAdapter {
    return new ExpressRequestAdapter(request as unknown as Request)
  }
}
