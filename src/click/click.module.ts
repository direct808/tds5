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
import { ActionService } from './schema/action/action.service'
import { ActionTypeFactory } from './schema/action/action-type-factory'
import {
  NothingActionType,
  Show404ActionType,
  ShowHtmlActionType,
  ShowTextActionType,
  ToCampaignActionType,
} from './schema/action/type'
import { LandingsOffersService } from './schema/landings-offers/landings-offers.service'
import { ClickIdService } from './click-id.service'
import { UserAgentService } from './user-agent.service'

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
    ActionService,
    ActionTypeFactory,
    NothingActionType,
    Show404ActionType,
    ShowHtmlActionType,
    ShowTextActionType,
    ToCampaignActionType,
    LandingsOffersService,
    ClickIdService,
    UserAgentService,
  ],
  imports: [CampaignModule, DirectUrlModule],
})
export class ClickModule {}
