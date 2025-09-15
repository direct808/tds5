import { Module } from '@nestjs/common'
import { ClickController } from './click.controller'
import { ClickService } from './click.service'
import { CampaignModule } from '@/domain/campaign/campaign.module'
import { SelectStreamService } from './select-stream.service'
import { HandleStreamService } from './handle-stream.service'
import { JsonResponseHandler } from './response-handler/json-response-handler'
import { HttpResponseHandler } from './response-handler/http-response-handler'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'
import { RegisterClickService } from './register-click.service'
import { ObserverModule } from '@/domain/click/observers/observer.module'
import { ClickSharedModule } from '@/domain/click/shared/click-shared.module'
import { StreamFilterModule } from '@/domain/stream-filter/stream-filter.module'
import { RequestAdapterModule } from '@/shared/request-adapter/request-adapter.module'
import { CampaignCacheModule } from '@/domain/campaign-cache/campaign-cache.module'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { SchemaModule } from '@/domain/click/schema/schema.module'

@Module({
  controllers: [ClickController],
  providers: [
    ClickService,
    SelectStreamService,
    HandleStreamService,
    JsonResponseHandler,
    HttpResponseHandler,
    ResponseHandlerFactory,

    RegisterClickService,
  ],
  imports: [
    CampaignModule,
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
