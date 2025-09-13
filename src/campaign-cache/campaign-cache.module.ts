import { Module } from '@nestjs/common'
import { CampaignCacheClearService } from '@/campaign-cache/campaign-cache-clear.service'
import { CampaignCacheService } from '@/campaign-cache/campaign-cache.service'
import { CampaignRepository } from '@/campaign/campaign.repository'
import { CampaignCacheListener } from '@/campaign-cache/listeners/campaign-cache.listener'

@Module({
  providers: [
    CampaignCacheClearService,
    CampaignCacheService,
    CampaignRepository,
    CampaignCacheListener,
  ],
  exports: [CampaignCacheService],
})
export class CampaignCacheModule {}
