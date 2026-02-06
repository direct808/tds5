import { Module } from '@nestjs/common'
import { AffiliateNetworkRepository } from './affiliate-network.repository'
import { CampaignRepository } from './campaign.repository'
import { ClickRepository } from './click.repository'
import { OfferRepository } from './offer.repository'
import { SourceRepository } from './source.repository'
import { UserRepository } from './user.repository'
import { StreamOfferRepository } from './stream-offer.repository'
import { ConversionRepository } from './conversion.repository'
import { ReportRepository } from './report.repository'
import { DomainRepository } from './domain.repository'

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
