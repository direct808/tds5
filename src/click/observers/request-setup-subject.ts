import { ClickSubject, RequestObserverData } from '@/click/observers/subject'
import { QueryStringObserver } from '@/click/observers/request/query-string.observer'
import { LanguageParserObserver } from '@/click/observers/request/language-parser.observer'
import { VisitorIdObserver } from '@/click/observers/request/visitor-id.observer'
import { UserAgentObserver } from '@/click/observers/request/user-agent.observer'
import { ClickContext } from '@/click/types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RequestSetupSubject {
  constructor(
    private readonly queryStringObserver: QueryStringObserver,
    private readonly languageParserObserver: LanguageParserObserver,
    private readonly visitorIdObserver: VisitorIdObserver,
    private readonly userAgentObserver: UserAgentObserver,
  ) {}

  public async setup(cContext: ClickContext) {
    const requestSubject = new ClickSubject<RequestObserverData>()

    requestSubject.attach(this.queryStringObserver)
    requestSubject.attach(this.languageParserObserver)
    requestSubject.attach(this.visitorIdObserver)
    requestSubject.attach(this.userAgentObserver)

    await requestSubject.notify(cContext)
  }
}
