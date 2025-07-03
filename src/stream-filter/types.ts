import { ClickData } from '@/click/click-data'

export type TextFilterTypes = 'referer'

export type FilterObject = TextFilterObject | QueryParamFilterObject

export interface TextFilterObject extends BaseFilterObject {
  type: TextFilterTypes
  values: string[]
}

export interface QueryParamFilterObject extends BaseFilterObject {
  type: 'query-param'
  name: string
  values: string[]
}

interface BaseFilterObject {
  exclude?: boolean
}

export interface StreamFilter {
  handle(clickData: ClickData): boolean
}

export interface Filters {
  logic: FilterLogic
  items: FilterObject[]
}

export enum FilterLogic {
  Or = 'or',
  And = 'and',
}
