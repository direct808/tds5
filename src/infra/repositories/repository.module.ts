import { Module } from '@nestjs/common'
import { AffiliateNetworkRepository } from '@/infra/repositories/affiliate-network.repository'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { UserRepository } from '@/infra/repositories/user.repository'
import { StreamOfferRepository } from '@/infra/repositories/stream-offer.repository'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import { ReportRepository } from '@/infra/repositories/report.repository'
import { DomainRepository } from '@/infra/repositories/domain.repository'

const repositories = [
  AffiliateNetworkRepository,
  StreamOfferRepository,
  ConversionRepository,
  CampaignRepository,
  DomainRepository,
  SourceRepository,
  ReportRepository,
  ClickRepository,
  OfferRepository,
  UserRepository,
]

@Module({
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
