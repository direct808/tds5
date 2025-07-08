import { Injectable } from '@nestjs/common'
import { FilterObject, StreamFilter } from '@/stream-filter/types'
import { TextFilter } from './text-filter'
import { QueryParamFilter } from './query-param-filter'
import { ClickData } from '@/click/click-data'
import { RequestAdapter } from '@/utils/request-adapter'
import { IpFilter } from './ip-filter'
import { BoolFilter } from '@/stream-filter/filters/bool-filter'
import { DateIntervalFilter } from '@/stream-filter/filters/date-interval-filter'

@Injectable()
export class StreamFilterFactory {
  create(
    filterObj: FilterObject,
    clickData: ClickData,
    request: RequestAdapter,
  ): StreamFilter {
    switch (filterObj.type) {
      case 'date':
        return new DateIntervalFilter(filterObj)
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
