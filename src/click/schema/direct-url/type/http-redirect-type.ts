import { HttpStatus, Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/click/types'

@Injectable()
export class HttpRedirectType implements RedirectType {
  handle(url: string): StreamResponse {
    return {
      status: HttpStatus.MOVED_PERMANENTLY,
      url,
    }
  }
}
