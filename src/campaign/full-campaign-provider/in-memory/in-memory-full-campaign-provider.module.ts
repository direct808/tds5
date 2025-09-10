import { Module } from '@nestjs/common'
import { FULL_CAMPAIGN_PROVIDER } from '../types'
import { InMemoryFullCampaignProvider } from './in-memory-full-campaign-provider'
import { DbFullCampaignProviderModule } from '@/campaign/full-campaign-provider/db/db-full-campaign-provider.module'

@Module({
  imports: [DbFullCampaignProviderModule],
  providers: [
    // CampaignDependencyListener,
    // InMemoryFullCampaignProvider,
    {
      provide: FULL_CAMPAIGN_PROVIDER,
      useClass: InMemoryFullCampaignProvider,
    },
  ],
  exports: [FULL_CAMPAIGN_PROVIDER],
})
export class InMemoryFullCampaignProviderModule {}
