import { OperationMap } from '@/domain/report/types'

export const postgresOperationMap = {
  ['>']: { sqlOperator: '>' },
  ['>=']: { sqlOperator: '>=' },
  ['<']: { sqlOperator: '<' },
  ['<=']: { sqlOperator: '<=' },
  ['=']: { sqlOperator: '=' },
  ['<>']: { sqlOperator: '<>' },
  ['in']: { sqlOperator: 'in' },
  ['not_in']: { sqlOperator: 'not in' },
  ['contains']: {
    sqlOperator: 'ilike',
    valueTransformer: (value) => `%${value}%`,
  },
  ['not_contains']: {
    sqlOperator: 'not ilike',
    valueTransformer: (value) => `%${value}%`,
  },
  ['starts_with']: {
    sqlOperator: 'ilike',
    valueTransformer: (value) => `${value}%`,
  },
  ['ends_with']: {
    sqlOperator: 'ilike',
    valueTransformer: (value) => `%${value}`,
  },
  ['regex']: { sqlOperator: '~*' },
  ['not_regex']: { sqlOperator: '!~*' },
} as OperationMap
