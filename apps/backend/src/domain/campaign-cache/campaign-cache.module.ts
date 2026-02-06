import { Module } from '@nestjs/common'
import { CampaignCacheClearService } from './campaign-cache-clear.service'
import { CampaignCacheService } from './campaign-cache.service'
import { CampaignCacheListener } from './listeners/campaign-cache.listener'
import { RedisModule } from '../../infra/redis/redis.module'
import { RepositoryModule } from '../../infra/repositories/repository.module'

@Module({
  imports: [RedisModule, RepositoryModule],
  providers: [
    CampaignCacheClearService,
    CampaignCacheService,
    CampaignCacheListener,
  ],
  exports: [CampaignCacheService],
})
export class CampaignCacheModule {}
