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
export interface DateIntervalFilterObject extends BaseFilterObject {
  type: 'date'
  from: string
  to: string
  timezone: string
}

interface BaseFilterObject {
  exclude?: boolean
}

export interface StreamFilter {
  handle(): boolean
}

export interface Filters {
  logic: FilterLogic
  items: FilterObject[]
}

export enum FilterLogic {
  Or = 'or',
  And = 'and',
}
