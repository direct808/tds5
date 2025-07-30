import { Injectable } from '@nestjs/common'
import { FilterObject, StreamFilter } from '@/stream-filter/types'
import { DateIntervalFilter } from '@/stream-filter/filters/date-interval/date-interval-filter'
import { IpFilter } from '@/stream-filter/filters/ip/ip-filter'
import { QueryParamFilter } from '@/stream-filter/filters/query-param/query-param-filter'
import { ScheduleFilter } from '@/stream-filter/filters/schedule/schedule-filter'
import { ClickLimitFilter } from '@/stream-filter/filters/click-limit/click-limit-filter'
import { ClickDataTextFilter } from '@/stream-filter/filters/click-data-text/click-data-text-filter'
import { ClickContext } from '@/click/shared/click-context.service'
import { IpV6Filter } from '@/stream-filter/filters/ipv6/ipv6-filter'
import { ClickUniqueFilter } from '@/stream-filter/filters/click-unique/click-unique-filter'
import { ClickRepository } from '@/click/shared/click.repository'

export interface IStreamFilterFactory {
  create(filterObj: FilterObject): StreamFilter
}

@Injectable()
export class StreamFilterFactory implements IStreamFilterFactory {
  constructor(
    private readonly clickContext: ClickContext,
    private readonly clickRepository: ClickRepository,
  ) {}

  // eslint-disable-next-line max-lines-per-function
  create(filterObj: FilterObject): StreamFilter {
    const requestAdapter = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    if (!clickData.campaignId) {
      throw new Error('No campaignId')
    }

    switch (filterObj.type) {
      case 'date':
        return new DateIntervalFilter(filterObj)
      case 'schedule':
        return new ScheduleFilter(filterObj)
      case 'click-limit':
        return new ClickLimitFilter(
          filterObj,
          this.clickRepository,
          clickData.campaignId,
        )
      case 'referer':
      case 'source':
      case 'keyword':
      case 'adCampaignId':
      case 'creativeId':
      case 'os':
      case 'osVersion':
      case 'browser':
      case 'browserVersion':
      case 'deviceType':
      case 'deviceModel':
      case 'userAgent':
      case 'language':
      case 'subId1':
      case 'subId2':
      case 'extraParam1':
      case 'extraParam2':
        return new ClickDataTextFilter(filterObj, clickData, filterObj.type)
      case 'click-unique':
        return new ClickUniqueFilter(filterObj, this.clickRepository, clickData)
      case 'ip':
        return new IpFilter(filterObj, clickData.ip)
      case 'ipv6':
        return new IpV6Filter(clickData.ip)
      case 'query-param':
        return new QueryParamFilter(filterObj, requestAdapter)
      default:
        const type = (filterObj as FilterObject).type
        throw new Error(`Unknown filter type ${type}`)
    }
  }
}
