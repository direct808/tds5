import { Injectable } from '@nestjs/common'
import { ClickObserver, RequestObserverData } from '@/click/observers/subject'

@Injectable()
export class LanguageParserObserver
  implements ClickObserver<RequestObserverData>
{
  public async handle({ request, clickData }: RequestObserverData) {
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
