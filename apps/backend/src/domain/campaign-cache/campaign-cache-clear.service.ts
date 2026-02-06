import { Injectable } from '@nestjs/common'
import {
  affiliateNetworkCacheKey,
  fullCampaignCodeCacheKey,
  fullCampaignCodeCacheKeys,
  fullCampaignDomainCacheKeys,
  offerCacheKey,
  sourceCacheKey,
} from './helpers/campaign-cache-keys'
import { RedisProvider } from '../../infra/redis/redis.provider'
import { CampaignRepository } from '../../infra/repositories/campaign.repository'

@Injectable()
export class CampaignCacheClearService {
  constructor(
    private readonly cache: RedisProvider,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async clearCacheByCampaignCode(code: string): Promise<void> {
    const keys = [fullCampaignCodeCacheKey(code)]
    const domains = await this.campaignRepository.getIndexPageDomainNames([
      code,
    ])

    keys.push(...fullCampaignDomainCacheKeys(domains))
    await this.cache.del(...keys)
  }

  public async clearCacheByDomainNames(domains: string[]): Promise<void> {
    const keys = fullCampaignDomainCacheKeys(domains)
    await this.cache.del(...keys)
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
    const keys = fullCampaignCodeCacheKeys(campaignCodes)
    keys.push(key)

    const domains =
      await this.campaignRepository.getIndexPageDomainNames(campaignCodes)

    keys.push(...fullCampaignDomainCacheKeys(domains))

    await this.cache.del(...keys)
  }
}
