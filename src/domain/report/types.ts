export type Formula = {
  formula: string
  summary: FormulaSummaryEnum
  decimals?: number
}
export type FormulaRecord = Record<string, Formula>

export enum Direction {
  asc = 'asc',
  desc = 'desc',
}
export enum FormulaSummaryEnum {
  sum = 'sum',
  avg = 'avg',
}

export enum QueryTablesEnum {
  source = 'source',
  campaign = 'campaign',
  stream = 'stream',
  offer = 'offer',
  affiliateNetwork = 'affiliateNetwork',
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

export type ReportResponse = {
  rows: Record<string, string>[]
  summary: Record<string, string>
  total: number
}

export type OperationMap = Record<
  FilterOperatorEnum,
  { sqlOperator: string; valueTransformer?: (value: string) => string }
>

export enum ReportRangeEnum {
  today = 'today',
  yestarday = 'yestarday',
  lastMonday = 'last_monday',
  ago7Days = '7_days_ago',
  firstDayOfThisMonth = 'first_day_of_this_month',
  previousMonth = 'previous_month',
  monthAgo = '1_month_ago',
  'firstDayOfThisYear' = 'first_day_of_this_year',
  allTime = 'all_time',
  customDateRange = 'custom_date_range',
  customTimeRange = 'custom_time_range',
}
