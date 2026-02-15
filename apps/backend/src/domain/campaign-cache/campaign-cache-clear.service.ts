import { Injectable } from '@nestjs/common'
import {
  affiliateNetworkCacheKey,
  fullCampaignCodeCacheKey,
  fullCampaignCodeCacheKeys,
  fullCampaignDomainCacheKeys,
  offerCacheKey,
  sourceCacheKey,
} from './helpers/campaign-cache-keys'
import { RedisProvider } from '@/infra/redis/redis.provider'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'

@Injectable()
export class CampaignCacheClearService {
  constructor(
    private readonly cache: RedisProvider,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async clearByCampaignCode(code: string): Promise<void> {
    const keys = [fullCampaignCodeCacheKey(code)]
    const domains = await this.campaignRepository.getIndexPageDomainNames([
      code,
    ])

    keys.push(...fullCampaignDomainCacheKeys(domains))
    await this.cache.del(...keys)
  }

  public async clearByDomainNames(domains: string[]): Promise<void> {
    const keys = fullCampaignDomainCacheKeys(domains)
    await this.cache.del(...keys)
  }

  public clearBySourceId(sourceId: string): Promise<void> {
    return this.clearByEntityCacheKey(sourceCacheKey(sourceId))
  }

  public clearByOfferId(offerId: string): Promise<void> {
    return this.clearByEntityCacheKey(offerCacheKey(offerId))
  }

  public clearByAffiliateNetworkId(affiliateNetworkId: string): Promise<void> {
    return this.clearByEntityCacheKey(
      affiliateNetworkCacheKey(affiliateNetworkId),
    )
  }

  private async clearByEntityCacheKey(entityKey: string): Promise<void> {
    const campaignCodes = await this.cache.sMembers(entityKey)
    const keys = fullCampaignCodeCacheKeys(campaignCodes)
    keys.push(entityKey)

    const domains =
      await this.campaignRepository.getIndexPageDomainNames(campaignCodes)

    keys.push(...fullCampaignDomainCacheKeys(domains))

    await this.cache.del(...keys)
  }
}
