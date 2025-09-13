import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Campaign } from '@/campaign/entity/campaign.entity'
import Redis from 'ioredis'
import { REDIS_CLIENT } from '@/config/app-redis.module'
import { CampaignRepository } from '@/campaign/campaign.repository'
import {
  affiliateNetworkCacheKey,
  fullCampaignCacheKey,
  offerCacheKey,
  sourceCacheKey,
} from './helpers'

const NOT_FOUND = 'N'

@Injectable()
export class CampaignCacheService {
  private readonly logger = new Logger(CampaignCacheService.name)
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async getFullByCode(code: string) {
    return this.redisWrap(this.redis, fullCampaignCacheKey(code), () =>
      this.getCampaignFromDb(code),
    )
  }

  private async getCampaignFromDb(code: string) {
    const campaign = await this.campaignRepository.getFullByCode(code)

    if (!campaign) {
      this.throwNotFound()
    }
    await this.setAdditionalCache(campaign)

    return campaign
  }

  private async setAdditionalCache(campaign: Campaign) {
    const { sourceId, offerIds, affiliateNetworkIdIds } =
      this.getCampaignAdditionalIds(campaign)

    const pipeline = this.redis.pipeline()

    offerIds.map((id) => pipeline.sadd(offerCacheKey(id), campaign.code))

    affiliateNetworkIdIds.map((id) =>
      pipeline.sadd(affiliateNetworkCacheKey(id), campaign.code),
    )

    if (sourceId) {
      pipeline.sadd(sourceCacheKey(sourceId), campaign.code)
    }

    await pipeline.exec()
  }

  private async redisWrap<T>(
    redis: Redis,
    key: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const cached = await redis.get(key)

    if (cached === NOT_FOUND) {
      this.throwNotFound()
    }

    if (cached) {
      this.logger.debug(`Get campaign from cache`)

      return JSON.parse(cached)
    }

    const result = await fn().catch(async (e) => {
      if (e instanceof NotFoundException) {
        await redis.set(key, NOT_FOUND)
      }
      throw e
    })
    await redis.set(key, JSON.stringify(result))
    this.logger.debug(`Get campaign from db`)

    return result
  }

  private getCampaignAdditionalIds(campaign: Campaign) {
    const sourceId = campaign.sourceId
    const offerIds: string[] = []
    const affiliateNetworkIdIds: string[] = []

    for (const stream of campaign.streams) {
      if (stream.streamOffers) {
        for (const streamOffer of stream.streamOffers) {
          if (!streamOffer.offer) {
            throw new Error('Offer not included')
          }
          offerIds.push(streamOffer.offer.id)

          if (streamOffer.offer.affiliateNetworkId) {
            affiliateNetworkIdIds.push(streamOffer.offer.affiliateNetworkId)
          }
        }
      }
    }

    return { sourceId, offerIds, affiliateNetworkIdIds }
  }

  private throwNotFound(): never {
    throw new NotFoundException('No campaign')
  }
}
