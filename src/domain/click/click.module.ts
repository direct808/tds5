import { Module } from '@nestjs/common'
import { ClickController } from './click.controller'
import { ClickService } from './click.service'
import { SelectStreamService } from './stream/select-stream.service'
import { JsonResponseHandler } from './response-handler/json-response-handler'
import { HttpResponseHandler } from './response-handler/http-response-handler'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'
import { RegisterClickService } from './register-click.service'
import { ObserverModule } from '@/domain/click/observers/observer.module'
import { ClickSharedModule } from '@/domain/click/shared/click-shared.module'
import { FilterModule } from '@/domain/click/stream/filter/filter.module'
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
    FilterModule,
    RequestAdapterModule,
    CampaignCacheModule,
    RepositoryModule,
  ],
})
export class ClickModule {}
