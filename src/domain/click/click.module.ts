import { Module } from '@nestjs/common'
import { ClickController } from './click.controller'
import { ClickService } from './click.service'
import { SelectStreamService } from './select-stream.service'
import { JsonResponseHandler } from './response-handler/json-response-handler'
import { HttpResponseHandler } from './response-handler/http-response-handler'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'
import { RegisterClickService } from './register-click.service'
import { ObserverModule } from '@/domain/click/observers/observer.module'
import { ClickSharedModule } from '@/domain/click/shared/click-shared.module'
import { StreamFilterModule } from '@/domain/click/stream/stream-filter/stream-filter.module'
import { RequestAdapterModule } from '@/shared/request-adapter/request-adapter.module'
import { CampaignCacheModule } from '@/domain/campaign-cache/campaign-cache.module'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { SchemaModule } from '@/domain/click/stream/schema/schema.module'

@Module({
  controllers: [ClickController],
  providers: [
    ClickService,
    SelectStreamService,
    JsonResponseHandler,
    HttpResponseHandler,
    ResponseHandlerFactory,
    RegisterClickService,
  ],
  imports: [
    SchemaModule,
    ObserverModule,
    ClickSharedModule,
    StreamFilterModule,
    RequestAdapterModule,
    CampaignCacheModule,
    RepositoryModule,
  ],
})
export class ClickModule {}
