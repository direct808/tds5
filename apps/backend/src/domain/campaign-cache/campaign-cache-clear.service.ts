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
import { DomainRepository } from '@/infra/repositories/domain.repository'

@Injectable()
export class CampaignCacheClearService {
  constructor(
    private readonly cache: RedisProvider,
    private readonly campaignRepository: CampaignRepository,
    private readonly domainRepository: DomainRepository,
  ) {}

  public async clearByCampaignCode(code: string): Promise<void> {
    const keys = [fullCampaignCodeCacheKey(code)]
    const domains = await this.campaignRepository.getIndexPageDomainNames([
      code,
    ])

    keys.push(...fullCampaignDomainCacheKeys(domains))
    await this.cache.del(...keys)
  }

  public async clearByCampaignIds(campaignIds: string[]): Promise<void> {
    const codes = await this.campaignRepository.getCodesByIds(campaignIds)
    const keys = fullCampaignCodeCacheKeys(codes)
    const domains = await this.campaignRepository.getIndexPageDomainNames(codes)

    keys.push(...fullCampaignDomainCacheKeys(domains))
    await this.cache.del(...keys)
  }

  public async clearByDomainNames(domains: string[]): Promise<void> {
    const keys = fullCampaignDomainCacheKeys(domains)
    await this.cache.del(...keys)
  }

  public async clearByDomainIds(domainIds: string[]): Promise<void> {
    const domains = await this.domainRepository.getNamesByIds(domainIds)
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
