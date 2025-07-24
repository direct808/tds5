import { BaseFilterObject, StreamFilter } from '@/stream-filter/types'
import { ClickData } from '@/click/click-data'

enum ClickUniqueFor {
  allCampaigns = 'allCampaigns',
  campaign = 'campaign',
  stream = 'stream',
}

export interface ClickUniqueFilterObj extends BaseFilterObject {
  type: 'click-unique'
  for: ClickUniqueFor
}

type ClickDataUniqueFilter = Pick<
  ClickData,
  'visitorId' | 'campaignId' | 'streamId'
>

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
    private readonly filterObj: ClickUniqueFilterObj,
    private readonly provider: ClickUniqueProvider,
    private readonly clickData: ClickDataUniqueFilter,
  ) {}

  async handle(): Promise<boolean> {
    const { visitorId, campaignId, streamId } = this.clickData

    if (!visitorId) {
      throw new Error('No visitorId')
    }

    if (!campaignId) {
      throw new Error('No campaignId')
    }

    if (!streamId) {
      throw new Error('No streamId')
    }
    const count = await this.getCount({ visitorId, campaignId, streamId })
    return count === 0
  }

  private getCount(
    clickData: Required<ClickDataUniqueFilter>,
  ): Promise<number> {
    const { visitorId, campaignId, streamId } = clickData
    switch (this.filterObj.for) {
      case ClickUniqueFor.allCampaigns:
        return this.provider.getCountByVisitorId(visitorId)

      case ClickUniqueFor.campaign:
        return this.provider.getCountByVisitorIdCampaignId(
          visitorId,
          campaignId,
        )

      case ClickUniqueFor.stream:
        return this.provider.getCountByVisitorIdStreamId(visitorId, streamId)

      default:
        const foR: never = this.filterObj.for
        throw new Error(`Unknown filterObj.for: "${foR}"`)
    }
  }
}
