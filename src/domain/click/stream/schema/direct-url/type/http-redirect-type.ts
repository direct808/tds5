import { HttpStatus, Injectable } from '@nestjs/common'
import type { RedirectType } from '@/domain/click/types'

@Injectable()
export class HttpRedirectType implements RedirectType {
  handle: RedirectType['handle'] = (url) => {
    return {
      status: HttpStatus.MOVED_PERMANENTLY,
      url,
    }
  }
}
