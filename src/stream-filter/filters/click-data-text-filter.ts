import { BaseFilterObject, StreamFilter } from '@/stream-filter/types'
import { ClickData } from '@/click/click-data'

export type ClickDataTextKeys =
  | 'referer'
  | 'source'
  | 'keyword'
  | 'adCampaignId'
  | 'creativeId'
  | 'city'
  | 'region'
  | 'country'

export interface ClickDataTextFilterObject extends BaseFilterObject {
  type: ClickDataTextKeys
  values: string[]
}

export class ClickDataTextFilter implements StreamFilter {
  constructor(
    private readonly filterObj: ClickDataTextFilterObject,
    private readonly clickData: ClickData,
    private readonly key: keyof Pick<ClickData, ClickDataTextKeys>,
  ) {}

  handle(): boolean {
    const values = this.filterObj.values

    if (values.length === 0) {
      return false
    }

    const value = this.clickData[this.key]

    return values.includes(value?.toString() || '')
  }
}
