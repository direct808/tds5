import { isURL } from 'class-validator'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/domain/click/types'

@Injectable()
export class RemoteRedirectType implements RedirectType {
  async handle(url: string): Promise<StreamResponse> {
    const data = await fetch(url).then((res) => res.text())
    const preparedUrl = data.trim()

    if (!isURL(preparedUrl, { require_protocol: true })) {
      throw new Error('Url not valid')
    }

    return {
      status: HttpStatus.MOVED_PERMANENTLY,
      url: preparedUrl,
    }
  }
}
