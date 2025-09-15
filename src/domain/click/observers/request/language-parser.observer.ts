import { Inject, Injectable } from '@nestjs/common'
import { ClickObserver } from '@/domain/click/observers/subject'
import {
  ClickContext,
  IClickContext,
} from '@/domain/click/shared/click-context.service'

@Injectable()
export class LanguageParserObserver implements ClickObserver {
  constructor(
    @Inject(ClickContext) private readonly clickContext: IClickContext,
  ) {}

  public handle() {
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
