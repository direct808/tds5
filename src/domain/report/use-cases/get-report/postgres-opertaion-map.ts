import { FilterOperatorEnum, OperationMap } from '@/domain/report/types'

export const postgresOperationMap = {
  [FilterOperatorEnum['>']]: { sqlOperator: '>' },
  [FilterOperatorEnum['<']]: { sqlOperator: '<' },
  [FilterOperatorEnum['=']]: { sqlOperator: '=' },
  [FilterOperatorEnum['<>']]: { sqlOperator: '<>' },
  [FilterOperatorEnum['in']]: { sqlOperator: 'in' },
  [FilterOperatorEnum['not_in']]: { sqlOperator: 'not in' },
  [FilterOperatorEnum['contains']]: {
    sqlOperator: 'ilike',
    valueTransformer: (value) => `%${value}%`,
  },
  [FilterOperatorEnum['not_contains']]: {
    sqlOperator: 'not ilike',
    valueTransformer: (value) => `%${value}%`,
  },
  [FilterOperatorEnum['starts_with']]: {
    sqlOperator: 'ilike',
    valueTransformer: (value) => `${value}%`,
  },
  [FilterOperatorEnum['ends_with']]: {
    sqlOperator: 'ilike',
    valueTransformer: (value) => `%${value}`,
  },
  [FilterOperatorEnum['regex']]: { sqlOperator: '~*' },
  [FilterOperatorEnum['not_regex']]: { sqlOperator: '!~*' },
} as OperationMap
