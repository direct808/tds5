import { Module, NestModule, RequestMethod } from '@nestjs/common'
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
import { ClickMiddleware } from '@/domain/click/click.middleware'
import { ClsMiddleware } from 'nestjs-cls'

@Module({
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
export class ClickModule implements NestModule {
  configure: NestModule['configure'] = (consumer) => {
    const routes = [
      { path: '/', method: RequestMethod.GET },
      { path: ':code([a-zA-Z0-9]{6})', method: RequestMethod.GET },
    ]

    consumer
      .apply(ClickMiddleware)
      .forRoutes(...routes)
      .apply(ClsMiddleware)
      .forRoutes(...routes)
  }
}
