import { Module } from '@nestjs/common'
import { LandingsOffersService } from './landings-offers.service'
import { OfferParamsService } from './offer-params.service'
import { OfferParamDataMapper } from './offer-params-data-mapper'
import { SelectOfferService } from './select-offer.service'
import { ClickSharedModule } from '@/click/shared/click-shared.module'

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
