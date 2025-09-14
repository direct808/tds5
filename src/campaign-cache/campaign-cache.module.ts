import { Module } from '@nestjs/common'
import { CampaignCacheClearService } from './campaign-cache-clear.service'
import { CampaignCacheService } from './campaign-cache.service'
import { CampaignRepository } from '@/campaign/campaign.repository'
import { CampaignCacheListener } from './listeners/campaign-cache.listener'
import { RedisModule } from '@/infra/redis/redis.module'

@Module({
  imports: [RedisModule],
  providers: [
    CampaignCacheClearService,
    CampaignCacheService,
    CampaignRepository,
    CampaignCacheListener,
  ],
  exports: [CampaignCacheService],
})
export class CampaignCacheModule {}
