import { Injectable } from '@nestjs/common'
import {
  affiliateNetworkCacheKey,
  fullCampaignCacheKey,
  offerCacheKey,
  sourceCacheKey,
} from './helpers/campaign-cache-keys'
import { RedisProvider } from '@/infra/redis/redis.provider'

@Injectable()
export class CampaignCacheClearService {
  constructor(private readonly cache: RedisProvider) {}

  public async clearCacheByCampaignCode(code: string): Promise<void> {
    await this.cache.del(fullCampaignCacheKey(code))
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
    const campaignCodes = await this.cache.sMembers(key)
    const keys: string[] = []
    keys.push(key)
    campaignCodes.forEach((code) => keys.push(fullCampaignCacheKey(code)))
    await this.cache.del(...keys)
  }
}
