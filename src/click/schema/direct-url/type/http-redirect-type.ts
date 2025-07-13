import { HttpStatus, Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '../../../types.js'

@Injectable()
export class HttpRedirectType implements RedirectType {
  async handle(url: string): Promise<StreamResponse> {
    return {
      status: HttpStatus.MOVED_PERMANENTLY,
      url,
    }
  }
}
