import { Injectable } from '@nestjs/common'
import { Campaign } from '@/campaign/entity/campaign.entity'
import { FullCampaignProvider } from '@/campaign/full-campaign-provider/types'
import { DbFullCampaignProvider } from '@/campaign/full-campaign-provider/db/db-full-campaign.provider'
import { FullCampaign } from '@/campaign/types'
import { getCampaignAdditionalIds } from '@/campaign/full-campaign-provider/helpers'

type StoreIds = Map<string, string[]>

const storeCampaign = new Map<string, FullCampaign>()
const storeOfferIds = new Map<string, string[]>()
const storeAffiliateNetworkIds = new Map<string, string[]>()
const storeSourceIds = new Map<string, string[]>()

@Injectable()
export class InMemoryFullCampaignProvider implements FullCampaignProvider {
  constructor(private readonly dbCampaignProvider: DbFullCampaignProvider) {}

  public async getFullByCode(code: string) {
    return this.cacheWrap(code, () => this.getCampaignFromDb(code))
  }

  public clearCacheByOfferId(offerId: string) {
    this.clearCacheById(offerId, storeOfferIds)
  }

  public clearCacheBySourceId(sourceId: string) {
    this.clearCacheById(sourceId, storeSourceIds)
  }

  public clearCacheByAffiliateNetworkId(affiliateNetworkId: string) {
    this.clearCacheById(affiliateNetworkId, storeAffiliateNetworkIds)
  }

  private clearCacheById(id: string, store: StoreIds) {
    const campaignCodes = store.get(id)

    if (!campaignCodes) {
      return
    }

    for (const code of campaignCodes) {
      store.delete(code)
    }
    store.delete(id)
  }

  private async getCampaignFromDb(code: string) {
    const campaign = await this.dbCampaignProvider.getFullByCode(code)
    this.setAdditionalCache(campaign)

    return campaign
  }

  private setAdditionalCache(campaign: Campaign) {
    const { sourceId, offerIds, affiliateNetworkIdIds } =
      getCampaignAdditionalIds(campaign)

    this.addArrayList(offerIds, campaign.code, storeOfferIds)

    this.addArrayList(
      affiliateNetworkIdIds,
      campaign.code,
      storeAffiliateNetworkIds,
    )

    if (sourceId) {
      this.addList(sourceId, campaign.code, storeSourceIds)
    }
  }

  private addArrayList(
    ids: string[],
    value: string,
    store: Map<string, string[]>,
  ): void {
    for (const id of ids) {
      this.addList(id, value, store)
    }
  }

  private addList(
    id: string,
    value: string,
    store: Map<string, string[]>,
  ): void {
    let items = store.get(id)
    if (!items) {
      items = []
      store.set(id, items)
    }
    items.push(value)
  }

  private async cacheWrap(
    key: string,
    fn: () => Promise<FullCampaign>,
  ): Promise<FullCampaign> {
    const cached = storeCampaign.get(key)
    if (cached) {
      return cached
    }

    const result = await fn()
    storeCampaign.set(key, result)

    return result
  }
}
