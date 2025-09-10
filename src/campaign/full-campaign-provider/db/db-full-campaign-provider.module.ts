import { Module } from '@nestjs/common'
import { FULL_CAMPAIGN_PROVIDER } from '../types'
import { DbFullCampaignProvider } from './db-full-campaign.provider'
import { CampaignRepository } from '@/campaign/campaign.repository'

@Module({
  providers: [
    CampaignRepository,
    DbFullCampaignProvider,
    {
      provide: FULL_CAMPAIGN_PROVIDER,
      useClass: DbFullCampaignProvider,
    },
  ],
  exports: [FULL_CAMPAIGN_PROVIDER, DbFullCampaignProvider],
})
export class DbFullCampaignProviderModule {}
