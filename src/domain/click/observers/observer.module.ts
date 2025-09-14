import { Module } from '@nestjs/common'
import { SetupSubject } from '@/domain/click/observers/setup-subject'
import { StreamSetupSubject } from '@/domain/click/observers/stream-setup-subject'
import { RequestSetupSubject } from '@/domain/click/observers/request-setup-subject'
import { ClickIdObserver } from '@/domain/click/observers/stream/click-id.observer'
import { QueryStringObserver } from '@/domain/click/observers/request/query-string.observer'
import { LanguageParserObserver } from '@/domain/click/observers/request/language-parser.observer'
import { VisitorIdObserver } from '@/domain/click/observers/request/visitor-id.observer'
import { UserAgentObserver } from '@/domain/click/observers/request/user-agent.observer'
import { IdGenerator } from '@/domain/click/observers/id-generator'
import { ClickSharedModule } from '@/domain/click/shared/click-shared.module'
import { GeoIpModule } from '@/domain/geo-ip/geo-ip.module'
import { GeoIpObserver } from '@/domain/click/observers/request/geo-ip.observer'

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
