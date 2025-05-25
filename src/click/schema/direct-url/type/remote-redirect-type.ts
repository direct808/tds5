import { isURL } from 'class-validator'
import { HttpStatus, Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '../../../types'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class RemoteRedirectType implements RedirectType {
  constructor(private readonly httpService: HttpService) {}

  async handle(url: string): Promise<StreamResponse> {
    const { data } = await firstValueFrom(this.httpService.get<string>(url))
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
