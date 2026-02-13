import { Injectable } from '@nestjs/common'
import { FilterObject, FilterObjectExtended, StreamFilter } from './types'
import { DateIntervalFilter } from './filters/date-interval/date-interval-filter'
import { IpFilter } from './filters/ip/ip-filter'
import { QueryParamFilter } from './filters/query-param/query-param-filter'
import { ScheduleFilter } from './filters/schedule/schedule-filter'
import { ClickLimitFilter } from './filters/click-limit/click-limit-filter'
import { ClickDataTextFilter } from './filters/click-data-text/click-data-text-filter'
import { ClickContext } from '../../shared/click-context.service'
import { IpV6Filter } from './filters/ipv6/ipv6-filter'
import { ClickUniqueFilter } from './filters/click-unique/click-unique-filter'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { isNullable } from '@/shared/helpers'

export interface IStreamFilterFactory {
  create(filterObj: FilterObjectExtended): StreamFilter
}

@Injectable()
export class FilterFactory implements IStreamFilterFactory {
  constructor(
    private readonly clickContext: ClickContext,
    private readonly clickRepository: ClickRepository,
  ) {}

  // eslint-disable-next-line complexity,max-lines-per-function
  create: IStreamFilterFactory['create'] = (filterObj) => {
    const requestAdapter = this.clickContext.getRequestAdapter()
    const clickData = this.clickContext.getClickData()

    if (isNullable(clickData.campaignId)) {
      throw new Error('No campaignId')
    }

    switch (filterObj.type) {
      case 'date-interval':
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
