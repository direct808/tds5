import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Campaign } from '@/domain/campaign/entity/campaign.entity'
import { getCampaignAdditionalIds } from '@/domain/campaign-cache/helpers/get-campaign-additional-ids'
import {
  affiliateNetworkCacheKey,
  fullCampaignCacheKey,
  offerCacheKey,
  sourceCacheKey,
} from './helpers/campaign-cache-keys'
import { RedisProvider } from '@/infra/redis/redis.provider'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { FullCampaign } from '@/domain/campaign/types'

const NOT_FOUND = 'N'

@Injectable()
export class CampaignCacheService {
  private readonly logger = new Logger(CampaignCacheService.name)
  constructor(
    private readonly redis: RedisProvider,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async getFullByCode(code: string): Promise<FullCampaign> {
    return this.redisWrap(fullCampaignCacheKey(code), () =>
      this.getCampaignFromDb(code),
    )
  }

  private async getCampaignFromDb(code: string): Promise<FullCampaign> {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      this.throwNotFound()
    }
    await this.setAdditionalCache(campaign)

    return campaign
  }

  private async setAdditionalCache(campaign: Campaign): Promise<void> {
    const { sourceId, offerIds, affiliateNetworkIdIds } =
      getCampaignAdditionalIds(campaign)

    const items: { key: string; value: string }[] = []

    offerIds.map((id) =>
      items.push({ key: offerCacheKey(id), value: campaign.code }),
    )

    affiliateNetworkIdIds.map((id) =>
      items.push({ key: affiliateNetworkCacheKey(id), value: campaign.code }),
    )

    if (sourceId) {
      items.push({ key: sourceCacheKey(sourceId), value: campaign.code })
    }

    await this.redis.sAdd(items)
  }

  private async redisWrap<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const cached = await this.redis.get(key)

    if (cached === NOT_FOUND) {
      this.throwNotFound()
    }

    if (cached) {
      this.logger.debug(`Get campaign from cache`)

      return JSON.parse(cached)
    }

    const result = await fn().catch(async (e) => {
      if (e instanceof NotFoundException) {
        await this.redis.set(key, NOT_FOUND)
      }
      throw e
    })
    await this.redis.set(key, JSON.stringify(result))
    this.logger.debug(`Get campaign from db`)

    return result
  }

  private throwNotFound(): never {
    throw new NotFoundException('No campaign')
  }
}
