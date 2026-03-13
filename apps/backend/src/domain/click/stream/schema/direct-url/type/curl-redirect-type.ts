import { URL } from 'url'
import { Injectable } from '@nestjs/common'
import type { RedirectType } from '@/domain/click/types'

@Injectable()
export class CurlRedirectType implements RedirectType {
  handle: RedirectType['handle'] = async (url) => {
    let content = await fetch(url).then((res) => res.text())

    content = this.setBase(content, this.prepareUrl(url))

    return {
      content,
    }
  }

  private setBase(content: string, url: string): string {
    return content.replace('<head>', `<head><base href="${url}">`)
  }

  private prepareUrl(url: string): string {
    const parsed = new URL(url)

    return `//${parsed.host}/`
  }
}
