import { ScheduleFilterObj } from '@/stream-filter/filters/schedule-filter'
import { DateIntervalFilterObject } from '@/stream-filter/filters/date-interval-filter'
import { ClickLimitFilterObj } from '@/stream-filter/filters/click-limit-filter'

export type TextFilterTypes =
  | 'referer'
  | 'source'
  | 'keyword'
  | 'searchEngine'
  | 'adCampaignId'
  | 'creativeId'
  | 'city'
  | 'region'
  | 'country'

export type FilterObject =
  | TextFilterObject
  | QueryParamFilterObject
  | DateIntervalFilterObject
  | ScheduleFilterObj
  | ClickLimitFilterObj

export interface TextFilterObject extends BaseFilterObject {
  type: TextFilterTypes
  values: string[]
}

export interface QueryParamFilterObject extends BaseFilterObject {
  type: 'query-param'
  name: string
  values: string[]
}

export interface BoolFilterObject extends BaseFilterObject {
  type: 'ipv6'
}

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
