type Row = {
  [key: string]: string | number
}

export type ReportResult = {
  rows: Row[]
  summary: Row[]
}

export type Formula = { formula: string; decimals?: number }
export type FormulaRecord = Record<string, Formula>

export enum Direction {
  asc = 'asc',
  desc = 'desc',
}

export enum FilterOperatorEnum {
  '=' = '=',
  '<>' = '<>',
  '>' = '>',
  '<' = '<',
  in = 'in',
  not_in = 'not_in',
  contains = 'contains',
  not_contains = 'not_contains',
  starts_with = 'starts_with',
  ends_with = 'ends_with',
  regex = 'regex',
  not_regex = 'not_regex',
  between = 'between',
}

export const FILTER_TYPE_MAP: Record<FilterTypeEnum, string> = {
  number: 'number',
  boolean: 'boolean',
  string: 'string',
  ip: 'string',
}

export enum FilterTypeEnum {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  ip = 'ip',
}
type FilterOperator = {
  types: FilterTypeEnum[]
  sqlOperator: string
}

export const FilterOperators: Record<FilterOperatorEnum, FilterOperator> = {
  '=': {
    sqlOperator: '=',
    types: [
      FilterTypeEnum.string,
      FilterTypeEnum.number,
      FilterTypeEnum.boolean,
      FilterTypeEnum.ip,
    ],
  },
  '<>': {
    sqlOperator: '<>',
    types: [FilterTypeEnum.string, FilterTypeEnum.number, FilterTypeEnum.ip],
  },
  '>': { sqlOperator: '>', types: [FilterTypeEnum.number] },
  '<': { sqlOperator: '<', types: [FilterTypeEnum.number] },
  in: { sqlOperator: 'in', types: [FilterTypeEnum.string] },
  not_in: { sqlOperator: 'not in', types: [FilterTypeEnum.string] },
  contains: { sqlOperator: 'ilike', types: [FilterTypeEnum.string] },
  not_contains: { sqlOperator: 'not ilike', types: [FilterTypeEnum.string] },
  starts_with: {
    sqlOperator: '=',
    types: [FilterTypeEnum.string, FilterTypeEnum.ip],
  },
  ends_with: {
    sqlOperator: '=',
    types: [FilterTypeEnum.string, FilterTypeEnum.ip],
  },
  regex: { sqlOperator: '=', types: [FilterTypeEnum.string] },
  not_regex: { sqlOperator: '=', types: [FilterTypeEnum.string] },
  between: { sqlOperator: '=', types: [FilterTypeEnum.number] },
} as const

export type InputFilterData = [
  field: string,
  operaor: FilterOperatorEnum,
  value: unknown,
]
