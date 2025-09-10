import { Module } from '@nestjs/common'
import * as process from 'node:process'
import { RedisFullCampaignProviderModule } from '@/campaign/full-campaign-provider/redis/redis-full-campaign-provider.module'
import { DbFullCampaignProviderModule } from '@/campaign/full-campaign-provider/db/db-full-campaign-provider.module'
import { InMemoryFullCampaignProviderModule } from '@/campaign/full-campaign-provider/in-memory/in-memory-full-campaign-provider.module'

const fullCampaignCacheModule = includeModule()

@Module({
  imports: [fullCampaignCacheModule],
  exports: [fullCampaignCacheModule],
})
export class FullCampaignProviderModule {}

function includeModule() {
  const campaignCacheType = process.env.CAMPAIGN_CACHE_TYPE
  switch (campaignCacheType) {
    case 'REDIS':
      return RedisFullCampaignProviderModule
    case 'IN_MEMORY':
      return InMemoryFullCampaignProviderModule
    case 'NONE':
      return DbFullCampaignProviderModule
    default:
      throw new Error('Unknown CAMPAIGN_CACHE_TYPE: ' + campaignCacheType)
  }
}
