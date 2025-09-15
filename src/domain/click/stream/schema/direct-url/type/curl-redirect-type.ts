import { URL } from 'url'
import { Injectable } from '@nestjs/common'
import { RedirectType, StreamResponse } from '@/domain/click/types'

@Injectable()
export class CurlRedirectType implements RedirectType {
  async handle(url: string): Promise<StreamResponse> {
    let content = await fetch(url).then((res) => res.text())

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
