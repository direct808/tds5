import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { ClickData } from '@/click/click-data'

type Args = {
  request: Request
  clickData: ClickData
}

@Injectable()
export class LanguageParser {
  public parse(args: Args) {
    const acceptLanguage = args.request.headers['accept-language']

    if (!this.checkValue(acceptLanguage)) {
      return
    }

    args.clickData.language = this.parseLang(acceptLanguage)
  }

  private checkValue(acceptLanguage: unknown): acceptLanguage is string {
    if (typeof acceptLanguage !== 'string') {
      return false
    }
    if (acceptLanguage.length < 2) {
      return false
    }
    return true
  }

  private parseLang(acceptLanguage: string): string {
    return acceptLanguage.substring(0, 2)
  }
}
