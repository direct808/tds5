import { ClickDataTextFilterObject } from './filters/click-data-text/click-data-text-filter'
import { DateIntervalFilterObject } from './filters/date-interval/date-interval-filter'
import { ScheduleFilterObj } from './filters/schedule/schedule-filter'
import { ClickLimitFilterObj } from './filters/click-limit/click-limit-filter'
import { IpFilterObject } from './filters/ip/ip-filter'
import { IpV6FilterObject } from './filters/ipv6/ipv6-filter'
import { ClickUniqueFilterObj } from './filters/click-unique/click-unique-filter'
import { QueryParamFilterObject } from './filters/query-param/query-param-filter'

export type FilterObject =
  | ClickDataTextFilterObject
  | QueryParamFilterObject
  | DateIntervalFilterObject
  | ScheduleFilterObj
  | ClickLimitFilterObj
  | IpFilterObject
  | IpV6FilterObject
  | ClickUniqueFilterObj

export type FilterObjectExtended = FilterObject & { streamId: string }

export interface BaseFilterObject {
  exclude?: boolean
}

export interface StreamFilter {
  handle(): boolean | Promise<boolean>
}

export interface Filters {
  logic: FilterLogic
  items: FilterObject[]
}

export enum FilterLogic {
  Or = 'or',
  And = 'and',
}
