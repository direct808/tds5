import { Module } from '@nestjs/common'
import { AffiliateNetworkController } from './affiliate-network.controller.js'
import { AffiliateNetworkService } from './affiliate-network.service.js'
import { AffiliateNetworkRepository } from './affiliate-network.repository.js'

@Module({
  controllers: [AffiliateNetworkController],
  providers: [AffiliateNetworkService, AffiliateNetworkRepository],
  exports: [AffiliateNetworkRepository],
})
export class AffiliateNetworkModule {}
