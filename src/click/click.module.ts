import { Module } from '@nestjs/common'
import { ClickController } from './click.controller.js'
import { ClickService } from './click.service.js'
import { CampaignModule } from '../campaign/campaign.module.js'
import { SelectStreamService } from './select-stream.service.js'
import { HandleStreamService } from './handle-stream.service.js'
import { DirectUrlModule } from './schema/direct-url/direct-url.module.js'
import { JsonResponseHandler } from './response-handler/json-response-handler.js'
import { HttpResponseHandler } from './response-handler/http-response-handler.js'
import { ResponseHandlerFactory } from './response-handler/response-handler-factory.js'
import { ActionService } from './schema/action/action.service.js'
import { ActionTypeFactory } from './schema/action/action-type-factory.js'
import {
  NothingActionType,
  Show404ActionType,
  ShowHtmlActionType,
  ShowTextActionType,
  ToCampaignActionType,
} from './schema/action/type/index.js'
import { RegisterClickService } from './register-click.service.js'
import { ClickRepository } from './click.repository.js'
import { LandingsOfferModule } from './schema/landings-offers/landings-offer.module.js'
import { ObserverModule } from './observers/observer.module.js'
import { ClickSharedModule } from './shared/click-shared.module.js'

@Module({
  controllers: [ClickController],
  providers: [
    ClickService,
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
    RegisterClickService,
    ClickRepository,
  ],
  imports: [
    CampaignModule,
    DirectUrlModule,
    LandingsOfferModule,
    ObserverModule,
    ClickSharedModule,
  ],
})
export class ClickModule {}
