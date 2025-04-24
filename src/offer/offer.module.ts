import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { OfferRepository } from './offer.repository'
import { AffiliateNetworkModule } from '../affiliate-network'

@Module({
  imports: [AffiliateNetworkModule],
  controllers: [OfferController],
  providers: [OfferService, OfferRepository],
})
export class OfferModule {}
