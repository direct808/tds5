import { ClickSubject } from './subject.js'
import { QueryStringObserver } from './request/query-string.observer.js'
import { LanguageParserObserver } from './request/language-parser.observer.js'
import { VisitorIdObserver } from './request/visitor-id.observer.js'
import { UserAgentObserver } from './request/user-agent.observer.js'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RequestSetupSubject {
  constructor(
    private readonly queryStringObserver: QueryStringObserver,
    private readonly languageParserObserver: LanguageParserObserver,
    private readonly visitorIdObserver: VisitorIdObserver,
    private readonly userAgentObserver: UserAgentObserver,
  ) {}

  public async setup() {
    const requestSubject = new ClickSubject()

    requestSubject.attach(this.queryStringObserver)
    requestSubject.attach(this.languageParserObserver)
    requestSubject.attach(this.visitorIdObserver)
    requestSubject.attach(this.userAgentObserver)

    await requestSubject.notify()
  }
}
