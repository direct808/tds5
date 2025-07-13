import { Module } from '@nestjs/common'
import { SetupSubject } from './setup-subject.js'
import { StreamSetupSubject } from './stream-setup-subject.js'
import { RequestSetupSubject } from './request-setup-subject.js'
import { StreamIdsObserver } from './stream/stream-ids-observer.js'
import { ClickIdObserver } from './stream/click-id.observer.js'
import { QueryStringObserver } from './request/query-string.observer.js'
import { LanguageParserObserver } from './request/language-parser.observer.js'
import { VisitorIdObserver } from './request/visitor-id.observer.js'
import { UserAgentObserver } from './request/user-agent.observer.js'
import { IdGenerator } from './id-generator.js'
import { ClickSharedModule } from '../shared/click-shared.module.js'

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
