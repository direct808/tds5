import { Request } from 'express'
import { Injectable } from '@nestjs/common'

export interface AppRequestData {
  ip?: string
  code: string
}

@Injectable()
export class RequestDataMapper {
  convert(code: string, request: Request): AppRequestData {
    const data = {
      code,
      ip: request.ip,
      // headers: this.makeKeyValHeaders(request),
      // query: request.url.split('?')[1],
    }

    return data
  }
}
