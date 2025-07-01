import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { OfferRepository } from './offer.repository'
import { AffiliateNetworkModule } from '@/affiliate-network/affiliate-network.module'

@Module({
  imports: [AffiliateNetworkModule],
  controllers: [OfferController],
  providers: [OfferService, OfferRepository],
  exports: [OfferRepository],
})
export class OfferModule {}
