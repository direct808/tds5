import { Module } from '@nestjs/common'
import { AffiliateNetworkController } from './affiliate-network.controller'
import { AffiliateNetworkService } from './affiliate-network.service'
import { AffiliateNetworkRepository } from './affiliate-network.repository'

@Module({
  controllers: [AffiliateNetworkController],
  providers: [AffiliateNetworkService, AffiliateNetworkRepository],
  exports: [AffiliateNetworkRepository],
})
export class AffiliateNetworkModule {}
