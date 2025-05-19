import { Module } from '@nestjs/common'
import { ClickController } from './click.controller'
import { ClickService } from './click.service'
import { RequestDataMapper } from './request-data-mapper'
import { CampaignModule } from '../campaign/campaign.module'
import { SelectStreamService } from './select-stream.service'
import { HandleStreamService } from './handle-stream.service'
import { DirectUrlModule } from './schema/direct-url/direct-url.module'
import { JsonResponseHandler } from './response-handler/json-response-handler'
import { HttpResponseHandler } from './response-handler/http-response-handler'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory'

@Module({
  controllers: [ClickController],
  providers: [
    ClickService,
    RequestDataMapper,
    SelectStreamService,
    HandleStreamService,
    JsonResponseHandler,
    HttpResponseHandler,
    ResponseHandlerFactory,
  ],
  imports: [CampaignModule, DirectUrlModule],
})
export class ClickModule {}
