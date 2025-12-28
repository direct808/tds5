import { FilterOperatorEnum, FormulaSummaryEnum } from '@/domain/report/types'
import { PrismaService } from '@/infra/prisma/prisma.service'

export class ReportQueryBuilder2 {
  private readonly _selectMetric: {
    query: string
    alias: string
    summary: FormulaSummaryEnum
  }[] = []

  private readonly _selectGroup: {
    query: string
    alias: string
  }[] = []

  private readonly _having: string[] = []
  private readonly _where: string[] = []
  private _groupBy: string[] = []
  private _orderBy: { field: string; order: 'asc' | 'desc' } | undefined
  private _pagination: { offset: number; limit: number } | undefined

  private operationMap = {
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
  } as Record<
    FilterOperatorEnum,
    { sqlOperator: string; valueTransformer?: (value: string) => string }
  >

  public static create(
    prisma: PrismaService,
    conversionTypes: string[],
  ): ReportQueryBuilder2 {
    return new this(prisma, conversionTypes)
  }

  private constructor(
    private readonly prisma: PrismaService,
    private readonly conversionTypes: string[],
  ) {}

  public setPagination(offset: number, limit: number): void {
    this._pagination = { offset, limit }
  }

  private buildSelect(select: { query: string; alias: string }[]): string[] {
    return select.map(({ query, alias }) => `${query} "${alias}"`)
  }

  private buildClickQuery(): string {
    const selectGroups = this.buildSelect(this._selectGroup)
    const selectMetric = this.buildSelect(this._selectMetric)

    const select: string[] = [...selectGroups, ...selectMetric]

    let query = `select ${select.join(', ')} from click`
    const conversionQuery = this.buildConversionQuery()
    if (conversionQuery) {
      query += ` left join (${conversionQuery}) c on c."clickId" = click.id`
    }

    if (this._where.length > 0) {
      query += ` where ${this._where.join(' and ')}`
    }

    if (this._groupBy.length > 0) {
      query += ` group by ${this._groupBy.join(', ')}`
    }

    if (this._having.length > 0) {
      query += ` having ${this._having.join(' and ')}`
    }

    if (this._orderBy) {
      const { field, order } = this._orderBy
      query += ` order by ${field} ${order}`
    }

    if (this._pagination) {
      const { limit, offset } = this._pagination
      query += ` offset ${offset} limit ${limit}`
    }

    return query
  }

  private buildConversionQuery(): string | undefined {
    const columns: string[] = []

    for (const key of this.conversionTypes) {
      columns.push(
        `count(*) filter (where status = '${key}') as conversions_${key}`,
      )

      columns.push(
        `sum(revenue) filter (where status = '${key}') as revenue_${key}`,
      )
    }

    if (columns.length === 0) {
      return
    }

    const columnsStr = columns.join(', ')

    return `select "clickId", ${columnsStr} from conversion group by "clickId"`
  }

  public selectGroup(query: string, alias: string): void {
    this._selectGroup.push({ query, alias })
    this._groupBy.push(query)
  }

  public selectMetric(
    query: string,
    alias: string,
    summary: FormulaSummaryEnum,
  ): void {
    this._selectMetric.push({ query, alias, summary })
  }

  public having(
    query: string,
    operator: FilterOperatorEnum,
    value: unknown,
  ): void {
    if (operator === FilterOperatorEnum.between) {
      return this.havingBetween(query, value)
    }
    const { sqlOperator, preparedValue } = this.getSqlOperatorAndValue(
      operator,
      value,
    )
    this._having.push(`${query} ${sqlOperator} ${preparedValue}`)
  }

  public whereGroup(
    query: string,
    operator: FilterOperatorEnum,
    value: unknown,
  ): this {
    if (operator === FilterOperatorEnum.between) {
      return this.whereBetween(query, value)
    }
    const { sqlOperator, preparedValue } = this.getSqlOperatorAndValue(
      operator,
      value,
    )
    this._where.push(`${query} ${sqlOperator} ${preparedValue}`)

    return this
  }

  private whereBetween(query: string, value: unknown): this {
    if (!Array.isArray(value)) {
      throw new Error('Value must be an array')
    }

    this._where.push(`${query} >= ${value[0]}`)
    this._where.push(`${query} <= ${value[1]}`)

    return this
  }

  private havingBetween(query: string, value: unknown): void {
    if (!Array.isArray(value)) {
      throw new Error('Value must be an array')
    }

    this._having.push(`${query} >= ${value[0]}`)
    this._having.push(`${query} <= ${value[1]}`)
  }

  private getSqlOperatorAndValue(
    operator: FilterOperatorEnum,
    value: unknown,
  ): { sqlOperator: string; preparedValue: unknown } {
    const operData = this.operationMap[operator]

    if (!operData) {
      throw new Error(`Unknown operator ${operator}`)
    }

    const { valueTransformer, sqlOperator } = operData

    let val = value
    if (valueTransformer) {
      if (typeof value !== 'string') {
        throw new Error('value for value transformer must be a string')
      }
      val = valueTransformer(value)
    }

    const wrappedVal = typeof val === 'string' ? `'${val}'` : val

    return {
      sqlOperator,
      preparedValue: wrappedVal,
    }
  }

  public groupBy(field: string): void {
    this._groupBy.push(`"${field}"`)
  }

  public orderBy(field: string, order: 'asc' | 'desc'): void {
    this._orderBy = { field, order }
  }

  public sql(): string {
    return this.buildClickQuery()
  }

  public execute(): Promise<Record<string, string>[]> {
    const query = this.buildClickQuery()
    // console.log(query)

    return this.prisma.$queryRawUnsafe(query)
  }

  public async executeSummary(): Promise<{
    summary: Record<string, string>
    total: number
  }> {
    const asdf = this._selectMetric
      .map(
        ({ alias, summary }) =>
          `coalesce(${summary}(${alias})::numeric(12,2), 0) ${alias}`,
      )
      .join(', ')

    const query = `select count(*) as total, ${asdf} from (${this.buildClickQuery()}) summary`
    console.log(query)

    const result =
      await this.prisma.$queryRawUnsafe<Record<string, string>[]>(query)

    if (!result[0]) {
      throw new Error('No result')
    }
    const { total, ...summary } = result[0]

    return {
      summary,
      total: Number(total),
    }
  }
}
