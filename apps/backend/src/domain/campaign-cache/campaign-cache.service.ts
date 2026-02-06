import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { getCampaignAdditionalIds } from './helpers/get-campaign-additional-ids'
import {
  affiliateNetworkCacheKey,
  fullCampaignCodeCacheKey,
  fullCampaignDomainCacheKey,
  offerCacheKey,
  sourceCacheKey,
} from './helpers/campaign-cache-keys'
import { RedisProvider } from '../../infra/redis/redis.provider'
import {
  CampaignRepository,
  GetFullByArgs,
} from '../../infra/repositories/campaign.repository'
import { FullCampaign } from '../campaign/types'

const NOT_FOUND = 'N'

@Injectable()
export class CampaignCacheService {
  private readonly logger = new Logger(CampaignCacheService.name)
  constructor(
    private readonly redis: RedisProvider,
    private readonly campaignRepository: CampaignRepository,
  ) {}

  public async getFull(args: GetFullByArgs): Promise<FullCampaign> {
    return this.redisWrap(this.fullCampaignCacheKey(args), () =>
      this.getCampaignFromDb(args),
    )
  }

  private async getCampaignFromDb(args: GetFullByArgs): Promise<FullCampaign> {
    const campaign = await this.campaignRepository.getFullBy(args)

    if (!campaign) {
      this.throwNotFound()
    }
    await this.setAdditionalCache(campaign)

    return campaign
  }

  private async setAdditionalCache(campaign: FullCampaign): Promise<void> {
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

  private fullCampaignCacheKey(args: GetFullByArgs): string {
    if ('code' in args) {
      return fullCampaignCodeCacheKey(args.code)
    }

    if ('domain' in args) {
      return fullCampaignDomainCacheKey(args.domain)
    }

    throw new Error('Unhandled GetFullByArgs')
  }
}
