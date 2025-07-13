import { Inject, Injectable } from '@nestjs/common'
import { ClickObserver } from '../subject.js'
import {
  ClickContext,
  IClickContext,
} from '../../shared/click-context.service.js'

@Injectable()
export class LanguageParserObserver implements ClickObserver {
  constructor(
    @Inject(ClickContext) private readonly clickContext: IClickContext,
  ) {}

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
