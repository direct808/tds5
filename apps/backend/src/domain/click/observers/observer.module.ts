import { Module } from '@nestjs/common'
import { SetupSubject } from './setup-subject'
import { StreamSetupSubject } from './stream-setup-subject'
import { RequestSetupSubject } from './request-setup-subject'
import { ClickIdObserver } from './stream/click-id.observer'
import { QueryStringObserver } from './request/query-string.observer'
import { LanguageParserObserver } from './request/language-parser.observer'
import { VisitorIdObserver } from './request/visitor-id.observer'
import { UserAgentObserver } from './request/user-agent.observer'
import { IdGenerator } from './id-generator'
import { ClickSharedModule } from '../shared/click-shared.module'
import { GeoIpModule } from '../../geo-ip/geo-ip.module'
import { GeoIpObserver } from './request/geo-ip.observer'

@Module({
  exports: [SetupSubject],
  providers: [
    SetupSubject,
    StreamSetupSubject,
    RequestSetupSubject,
    ClickIdObserver,
    QueryStringObserver,
    LanguageParserObserver,
    VisitorIdObserver,
    UserAgentObserver,
    IdGenerator,
    GeoIpObserver,
  ],
  imports: [ClickSharedModule, GeoIpModule],
})
export class ObserverModule {}
