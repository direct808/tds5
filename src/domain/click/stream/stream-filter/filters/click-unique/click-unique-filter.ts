import {
  BaseFilterObject,
  StreamFilter,
} from '@/domain/click/stream/stream-filter/types'
import { ClickData } from '@/domain/click/click-data'

export enum ClickUniqueFor {
  allCampaigns = 'allCampaigns',
  campaign = 'campaign',
  stream = 'stream',
}

export interface ClickUniqueFilterObj extends BaseFilterObject {
  type: 'click-unique'
  for: ClickUniqueFor
}

type ClickDataUniqueFilter = Pick<ClickData, 'visitorId' | 'campaignId'>

export interface ClickUniqueProvider {
  getCountByVisitorId(visitorId: string): Promise<number>

  getCountByVisitorIdCampaignId(
    visitorId: string,
    campaignId: string,
  ): Promise<number>

  getCountByVisitorIdStreamId(
    visitorId: string,
    streamId: string,
  ): Promise<number>
}

export class ClickUniqueFilter implements StreamFilter {
  constructor(
    private readonly filterObj: ClickUniqueFilterObj & { streamId: string },
    private readonly provider: ClickUniqueProvider,
    private readonly clickData: ClickDataUniqueFilter,
  ) {}

  async handle(): Promise<boolean> {
    const { visitorId, campaignId } = this.clickData

    if (!visitorId) {
      throw new Error('No visitorId')
    }

    if (!campaignId) {
      throw new Error('No campaignId')
    }

    const count = await this.getCount({ visitorId, campaignId })

    return count === 0
  }

  private getCount(
    clickData: Required<ClickDataUniqueFilter>,
  ): Promise<number> {
    const { visitorId, campaignId } = clickData
    switch (this.filterObj.for) {
      case ClickUniqueFor.allCampaigns:
        return this.provider.getCountByVisitorId(visitorId)

      case ClickUniqueFor.campaign:
        return this.provider.getCountByVisitorIdCampaignId(
          visitorId,
          campaignId,
        )

      case ClickUniqueFor.stream:
        return this.provider.getCountByVisitorIdStreamId(
          visitorId,
          this.filterObj.streamId,
        )

      default:
        const foR: never = this.filterObj.for
        throw new Error(`Unknown filterObj.for: "${foR}"`)
    }
  }
}
