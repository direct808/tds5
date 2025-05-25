import { URL } from 'url'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { RedirectType, StreamResponse } from '../../../types'

@Injectable()
export class CurlRedirectType implements RedirectType {
  constructor(private readonly httpService: HttpService) {}

  async handle(url: string): Promise<StreamResponse> {
    let { data: content } = await firstValueFrom(
      this.httpService.get<string>(url),
    )

    content = this.setBase(content, this.prepareUrl(url))

    return {
      content,
    }
  }

  private setBase(content: string, url: string) {
    return content.replace('<head>', `<head><base href="${url}">`)
  }

  private prepareUrl(url: string) {
    const parsed = new URL(url)

    return `//${parsed.host}/`
  }
}
