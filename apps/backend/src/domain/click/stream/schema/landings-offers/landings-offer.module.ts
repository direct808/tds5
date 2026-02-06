import { Module } from '@nestjs/common'
import { LandingsOffersService } from './landings-offers.service'
import { OfferParamsService } from './offer-params.service'
import { OfferParamDataMapper } from './offer-params-data-mapper'
import { SelectOfferService } from './select-offer.service'
import { ClickSharedModule } from '../../../shared/click-shared.module'

@Module({
  imports: [ClickSharedModule],
  providers: [
    LandingsOffersService,
    OfferParamsService,
    OfferParamDataMapper,
    SelectOfferService,
  ],
  exports: [LandingsOffersService],
})
export class LandingsOfferModule {}
