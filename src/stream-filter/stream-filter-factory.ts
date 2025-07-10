import { Injectable } from '@nestjs/common'
import { FilterObject, StreamFilter } from '@/stream-filter/types'
import { DateIntervalFilter } from '@/stream-filter/filters/date-interval-filter'
import { IpFilter } from '@/stream-filter/filters/ip-filter'
import { QueryParamFilter } from '@/stream-filter/filters/query-param-filter'
import { ScheduleFilter } from '@/stream-filter/filters/schedule-filter'
import {
  ClickLimitFilter,
  ClickLimitProvider,
} from '@/stream-filter/filters/click-limit-filter'
import { ClickDataTextFilter } from '@/stream-filter/filters/click-data-text-filter'
import { ClickContextService } from '@/click/click-context.service'

@Injectable()
export class StreamFilterFactory {
  private clickLimitProvider: ClickLimitProvider = {
    getClickPerHour: (): Promise<number> => Promise.resolve(1),
    getClickPerDay: (): Promise<number> => Promise.resolve(1),
    getClickTotal: (): Promise<number> => Promise.resolve(1),
  }

  constructor(private readonly clickContext: ClickContextService) {}

  // e slint-disable-next-line max-lines-per-function
  create(filterObj: FilterObject): StreamFilter {
    const requestAdapter = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    switch (filterObj.type) {
      case 'date':
        return new DateIntervalFilter(filterObj)
      case 'schedule':
        return new ScheduleFilter(filterObj)
      case 'click-limit':
        return new ClickLimitFilter(filterObj, this.clickLimitProvider)
      case 'referer':
      case 'source':
      case 'keyword':
      case 'adCampaignId':
      case 'creativeId':
        // case 'city':
        // case 'region':
        // case 'searchEngine':
        // case 'country':
        return new ClickDataTextFilter(filterObj, clickData, filterObj.type)

      case 'ip':
        return new IpFilter(filterObj, clickData.ip)
      // case 'ipv6':
      //   return new BoolFilter(filterObj, clickData, filterObj.type)
      case 'query-param':
        return new QueryParamFilter(filterObj, requestAdapter)
      default:
        const type = (filterObj as FilterObject).type
        throw new Error(`Unknown filter type ${type}`)
    }
  }
}
