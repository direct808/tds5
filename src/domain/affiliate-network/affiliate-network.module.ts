import { Module } from '@nestjs/common'
import { AffiliateNetworkController } from './affiliate-network.controller'
import { AffiliateNetworkService } from './affiliate-network.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  imports: [RepositoryModule],
  controllers: [AffiliateNetworkController],
  providers: [AffiliateNetworkService],
})
export class AffiliateNetworkModule {}
