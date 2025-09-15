import {
  BaseFilterObject,
  StreamFilter,
} from '@/domain/click/stream/stream-filter/types'
import { ClickData } from '@/domain/click/click-data'

export type ClickDataTextKeys =
  | 'referer'
  | 'source'
  | 'keyword'
  | 'adCampaignId'
  | 'creativeId'
  | 'city'
  | 'region'
  | 'country'
  | 'os'
  | 'osVersion'
  | 'browser'
  | 'browserVersion'
  | 'deviceType'
  | 'deviceModel'
  | 'userAgent'
  | 'language'
  | 'subId1'
  | 'subId2'
  | 'extraParam1'
  | 'extraParam2'

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
