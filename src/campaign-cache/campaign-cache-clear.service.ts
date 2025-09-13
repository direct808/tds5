import { Inject } from '@nestjs/common'
import { REDIS_CLIENT } from '@/config/app-redis.module'
import Redis from 'ioredis'
import {
  affiliateNetworkCacheKey,
  fullCampaignCacheKey,
  offerCacheKey,
  sourceCacheKey,
} from './helpers'

export class CampaignCacheClearService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  public async clearCacheByCampaignCode(code: string): Promise<void> {
    await this.redis.del(fullCampaignCacheKey(code))
  }

  public clearCacheBySourceId(sourceId: string): Promise<void> {
    return this.clearCacheById(sourceCacheKey(sourceId))
  }

  public clearCacheByOfferId(offerId: string): Promise<void> {
    return this.clearCacheById(offerCacheKey(offerId))
  }

  public clearCacheByAffiliateNetworkId(
    affiliateNetworkId: string,
  ): Promise<void> {
    return this.clearCacheById(affiliateNetworkCacheKey(affiliateNetworkId))
  }

  private async clearCacheById(key: string): Promise<void> {
    const campaignCodes = await this.redis.smembers(key)

    const pipeline = this.redis.pipeline()

    pipeline.del(key)

    for (const code of campaignCodes) {
      pipeline.del(fullCampaignCacheKey(code))
    }

    await pipeline.exec()
  }
}
