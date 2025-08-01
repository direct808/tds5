import { Module } from '@nestjs/common'
import { SetupSubject } from '@/click/observers/setup-subject'
import { StreamSetupSubject } from '@/click/observers/stream-setup-subject'
import { RequestSetupSubject } from '@/click/observers/request-setup-subject'
import { ClickIdObserver } from '@/click/observers/stream/click-id.observer'
import { QueryStringObserver } from '@/click/observers/request/query-string.observer'
import { LanguageParserObserver } from '@/click/observers/request/language-parser.observer'
import { VisitorIdObserver } from '@/click/observers/request/visitor-id.observer'
import { UserAgentObserver } from '@/click/observers/request/user-agent.observer'
import { IdGenerator } from '@/click/observers/id-generator'
import { ClickSharedModule } from '@/click/shared/click-shared.module'

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
  ],
  imports: [ClickSharedModule],
})
export class ObserverModule {}
