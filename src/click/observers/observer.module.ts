import { Module } from '@nestjs/common'
import { SetupSubject } from '@/click/observers/setup-subject.js'
import { StreamSetupSubject } from '@/click/observers/stream-setup-subject.js'
import { RequestSetupSubject } from '@/click/observers/request-setup-subject.js'
import { StreamIdsObserver } from '@/click/observers/stream/stream-ids-observer.js'
import { ClickIdObserver } from '@/click/observers/stream/click-id.observer.js'
import { QueryStringObserver } from '@/click/observers/request/query-string.observer.js'
import { LanguageParserObserver } from '@/click/observers/request/language-parser.observer.js'
import { VisitorIdObserver } from '@/click/observers/request/visitor-id.observer.js'
import { UserAgentObserver } from '@/click/observers/request/user-agent.observer.js'
import { IdGenerator } from '@/click/observers/id-generator.js'
import { ClickSharedModule } from '@/click/shared/click-shared.module.js'

@Module({
  exports: [SetupSubject],
  providers: [
    SetupSubject,
    StreamSetupSubject,
    RequestSetupSubject,
    StreamIdsObserver,
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
