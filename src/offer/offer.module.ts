import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller.js'
import { OfferService } from './offer.service.js'
import { OfferRepository } from './offer.repository.js'
import { AffiliateNetworkModule } from '@/affiliate-network/affiliate-network.module.js'

@Module({
  imports: [AffiliateNetworkModule],
  controllers: [OfferController],
  providers: [OfferService, OfferRepository],
  exports: [OfferRepository],
})
export class OfferModule {}
