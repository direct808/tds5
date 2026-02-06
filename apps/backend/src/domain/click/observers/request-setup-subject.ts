import { ClickSubject } from './subject'
import { QueryStringObserver } from './request/query-string.observer'
import { LanguageParserObserver } from './request/language-parser.observer'
import { VisitorIdObserver } from './request/visitor-id.observer'
import { UserAgentObserver } from './request/user-agent.observer'
import { Injectable } from '@nestjs/common'
import { GeoIpObserver } from './request/geo-ip.observer'

@Injectable()
export class RequestSetupSubject {
  constructor(
    private readonly queryStringObserver: QueryStringObserver,
    private readonly languageParserObserver: LanguageParserObserver,
    private readonly visitorIdObserver: VisitorIdObserver,
    private readonly userAgentObserver: UserAgentObserver,
    private readonly geoIpObserver: GeoIpObserver,
  ) {}

  public async setup(): Promise<void> {
    const requestSubject = new ClickSubject()

    requestSubject.attach(this.queryStringObserver)
    requestSubject.attach(this.languageParserObserver)
    requestSubject.attach(this.visitorIdObserver)
    requestSubject.attach(this.userAgentObserver)
    requestSubject.attach(this.geoIpObserver)

    await requestSubject.notify()
  }
}
