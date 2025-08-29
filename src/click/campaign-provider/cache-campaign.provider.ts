import { Inject, Injectable, Logger } from '@nestjs/common'
import { CampaignProvider } from '@/click/campaign-provider/campaign.provider'
import { DBCampaignProvider } from '@/click/campaign-provider/db-campaign.provider'
import { Campaign } from '@/campaign/entity/campaign.entity'
import Redis from 'ioredis'
import { REDIS_CLIENT } from '@/config/app-redis.module'

@Injectable()
export class CacheCampaignProvider implements CampaignProvider {
  private readonly logger = new Logger(CacheCampaignProvider.name)

  private affiliateNetworkCacheKey = (id: string) =>
    `affiliateNetwork:${id}:campaignCodes`

  private offerCacheKey = (id: string) => `offer:${id}:campaignCodes`
  private sourceCacheKey = (id: string) => `source:${id}:campaignCodes`
  private fullCampaignCacheKey = (code: string) => `fullCampaign:${code}`

  constructor(
    private readonly dbCampaignProvider: DBCampaignProvider,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  public async getFullByCode(code: string) {
    return this.redisWrap(this.redis, this.fullCampaignCacheKey(code), () =>
      this.getCampaignFromDb(code),
    )
  }

  public async clearCacheBySourceId(sourceId: string) {
    const sourceKey = this.sourceCacheKey(sourceId)
    const campaignCodes = await this.redis.smembers(sourceKey)

    const promises: Promise<number>[] = [this.redis.del(sourceKey)]

    for (const code of campaignCodes) {
      promises.push(this.redis.del(this.fullCampaignCacheKey(code)))
    }

    await Promise.all(promises)
  }

  private async getCampaignFromDb(code: string) {
    const campaign = await this.dbCampaignProvider.getFullByCode(code)
    await this.setAdditionalCache(campaign)

    return campaign
  }

  private async setAdditionalCache(campaign: Campaign) {
    const { sourceId, offerIds, affiliateNetworkIdIds } =
      this.getCampaignAdditionalIds(campaign)

    const promises: Promise<number>[] = []

    promises.push(
      ...this.addArrayList(offerIds, campaign.code, this.offerCacheKey),
    )

    promises.push(
      ...this.addArrayList(
        affiliateNetworkIdIds,
        campaign.code,
        this.affiliateNetworkCacheKey,
      ),
    )

    const sourcePromise = this.addList(
      sourceId,
      campaign.code,
      this.sourceCacheKey,
    )

    if (sourcePromise) {
      promises.push(sourcePromise)
    }

    await Promise.all(promises)
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

  private addArrayList(
    ids: string[],
    value: string,
    cacheKeyFn: (id: string) => string,
  ): Promise<number>[] {
    const promises: Promise<number>[] = []
    if (ids.length === 0) {
      return promises
    }

    promises.push(...ids.map((id) => this.redis.sadd(cacheKeyFn(id), value)))

    return promises
  }

  private addList(
    id: string | undefined,
    value: string,
    cacheKeyFn: (id: string) => string,
  ): Promise<number> | undefined {
    if (!id) {
      return
    }

    return this.redis.sadd(cacheKeyFn(id), value)
  }

  private async redisWrap<T>(
    redis: Redis,
    key: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const cached = await redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    const result = await fn()
    await redis.set(key, JSON.stringify(result))

    return result
  }
}
