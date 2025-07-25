import { Module } from '@nestjs/common'
import { ClickController } from './click.controller'
import { ClickService } from './click.service'
import { CampaignModule } from '@/campaign/campaign.module'
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
import { RegisterClickService } from './register-click.service'
import { ClickRepository } from './click.repository'
import { LandingsOfferModule } from './schema/landings-offers/landings-offer.module'
import { ObserverModule } from '@/click/observers/observer.module'
import { ClickSharedModule } from '@/click/shared/click-shared.module'

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
