import { Module } from '@nestjs/common'
import { LandingsOffersService } from './landings-offers.service.js'
import { OfferParamsService } from './offer-params.service.js'
import { OfferParamDataMapper } from './offer-params-data-mapper.js'
import { SelectOfferService } from './select-offer.service.js'
import { ClickSharedModule } from '@/click/shared/click-shared.module.js'

@Module({
  exports: [LandingsOffersService],
  providers: [
    LandingsOffersService,
    OfferParamsService,
    OfferParamDataMapper,
    SelectOfferService,
  ],
  imports: [ClickSharedModule],
})
export class LandingsOfferModule {}
