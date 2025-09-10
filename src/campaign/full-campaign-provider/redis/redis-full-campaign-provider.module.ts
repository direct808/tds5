import { Module } from '@nestjs/common'
import { FULL_CAMPAIGN_PROVIDER } from '../types'
import { RedisFullCampaignProvider } from './redis-full-campaign-provider'
import { CampaignDependencyListener } from '@/campaign/full-campaign-provider/redis/campaign-dependency.listener'
import { DbFullCampaignProviderModule } from '@/campaign/full-campaign-provider/db/db-full-campaign-provider.module'

@Module({
  imports: [DbFullCampaignProviderModule],
  providers: [
    CampaignDependencyListener,
    RedisFullCampaignProvider,
    {
      provide: FULL_CAMPAIGN_PROVIDER,
      useClass: RedisFullCampaignProvider,
    },
  ],
  exports: [FULL_CAMPAIGN_PROVIDER],
})
export class RedisFullCampaignProviderModule {}
