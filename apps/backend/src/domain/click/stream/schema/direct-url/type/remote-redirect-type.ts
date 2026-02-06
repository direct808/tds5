import { isURL } from 'class-validator'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RedirectType } from '../../../../types'

@Injectable()
export class RemoteRedirectType implements RedirectType {
  handle: RedirectType['handle'] = async (url) => {
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
