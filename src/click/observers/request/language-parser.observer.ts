import { Injectable } from '@nestjs/common'
import { ClickObserver } from '@/click/observers/subject'
import { ClickContext } from '@/click/shared/click-context.service'

@Injectable()
export class LanguageParserObserver implements ClickObserver {
  constructor(private readonly clickContext: ClickContext) {}

  public async handle() {
    const request = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    const acceptLanguage = request.header('accept-language')

    if (!this.checkValue(acceptLanguage)) {
      return
    }

    clickData.language = this.parseLang(acceptLanguage)
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
