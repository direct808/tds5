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

export enum FilterTypeEnum {
  numeric = 'numeric',
  boolean = 'boolean',
  string = 'string',
  ip = 'ip',
}
type FilterOperator = {
  types: FilterTypeEnum[]
}

export const FilterOperators: Record<FilterOperatorEnum, FilterOperator> = {
  '=': {
    types: [
      FilterTypeEnum.string,
      FilterTypeEnum.numeric,
      FilterTypeEnum.boolean,
      FilterTypeEnum.ip,
    ],
  },
  '<>': {
    types: [FilterTypeEnum.string, FilterTypeEnum.numeric, FilterTypeEnum.ip],
  },
  '>': { types: [FilterTypeEnum.numeric] },
  '<': { types: [FilterTypeEnum.numeric] },
  in: { types: [FilterTypeEnum.string] },
  not_in: { types: [FilterTypeEnum.string] },
  contains: { types: [FilterTypeEnum.string] },
  not_contains: { types: [FilterTypeEnum.string] },
  starts_with: { types: [FilterTypeEnum.string, FilterTypeEnum.ip] },
  ends_with: { types: [FilterTypeEnum.string, FilterTypeEnum.ip] },
  regex: { types: [FilterTypeEnum.string] },
  not_regex: { types: [FilterTypeEnum.string] },
  between: { types: [FilterTypeEnum.numeric] },
} as const
