import { Module } from '@nestjs/common'
import { AffiliateNetworkRepository } from '@/infra/repositories/affiliate-network.repository'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { UserRepository } from '@/infra/repositories/user.repository'

const repositories = [
  AffiliateNetworkRepository,
  CampaignRepository,
  ClickRepository,
  OfferRepository,
  SourceRepository,
  UserRepository,
]

@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
