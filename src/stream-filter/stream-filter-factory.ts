import { Injectable } from '@nestjs/common'
import { FilterObject, StreamFilter } from '@/stream-filter/types'
import { ClickData } from '@/click/click-data'
import { RequestAdapter } from '@/utils/request-adapter'
import { BoolFilter } from '@/stream-filter/filters/bool-filter'
import { DateIntervalFilter } from '@/stream-filter/filters/date-interval-filter'
import { TextFilter } from '@/stream-filter/filters/text-filter'
import { IpFilter } from '@/stream-filter/filters/ip-filter'
import { QueryParamFilter } from '@/stream-filter/filters/query-param-filter'
import { ScheduleFilter } from '@/stream-filter/filters/schedule-filter'
import {
  ClickLimitFilter,
  ClickLimitProvider,
} from '@/stream-filter/filters/click-limit-filter'

@Injectable()
export class StreamFilterFactory {
  create(
    filterObj: FilterObject,
    clickData: ClickData,
    request: RequestAdapter,
    clickLimitProvider: ClickLimitProvider,
  ): StreamFilter {
    switch (filterObj.type) {
      case 'date':
        return new DateIntervalFilter(filterObj)
      case 'schedule':
        return new ScheduleFilter(filterObj)
      case 'click-limit':
        return new ClickLimitFilter(filterObj, clickLimitProvider)
      case 'referer':
        return new TextFilter(filterObj, clickData.referer)
      case 'source':
        return new TextFilter(filterObj, clickData.source)
      case 'keyword':
        return new TextFilter(filterObj, clickData.keyword)
      // case 'searchEngine':
      //   return new TextFilter(filterObj, clickData.searchEngine)
      case 'adCampaignId':
        return new TextFilter(filterObj, clickData.adCampaignId)
      case 'creativeId':
        return new TextFilter(filterObj, clickData.creativeId)
      case 'city':
        return new TextFilter(filterObj, clickData.city)
      case 'region':
        return new TextFilter(filterObj, clickData.region)
      case 'country':
        return new TextFilter(filterObj, clickData[filterObj.type])
      case 'ip':
        return new IpFilter(filterObj, clickData, filterObj.type)
      case 'ipv6':
        return new BoolFilter(filterObj, clickData, filterObj.type)
      case 'query-param':
        return new QueryParamFilter(filterObj, request)
      default:
        const type = (filterObj as FilterObject).type
        throw new Error(`Unknown filter type ${type}`)
    }
  }
}
