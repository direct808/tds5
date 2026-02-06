import {
  FilterOperatorEnum,
  FormulaSummaryEnum,
  QueryTablesEnum,
} from '../types'
import { PrismaService } from '../../../infra/prisma/prisma.service'
import { postgresOperationMap } from '../postgres-opertaion-map'
import { ValueManager } from './value-manager'

export class PostgresRawReportQueryBuilder {
  private readonly _selectMetric: {
    query: string
    alias: string
    summary: FormulaSummaryEnum
  }[] = []

  private readonly _selectGroup: {
    query: string
    alias: string
  }[] = []

  private readonly _having: string[] = ['count(*) > 0']
  private readonly _where: string[] = []
  private _groupBy: string[] = []
  private _orderBy: { field: string; order: 'asc' | 'desc' } | undefined
  private _pagination: { offset: number; limit: number } | undefined
  private readonly values = new ValueManager()
  private timeZonePlaceHolder: string | undefined
  private readonly tables = new Set<QueryTablesEnum>()

  public constructor(
    private readonly prisma: PrismaService,
    private readonly timeZone: string,
    private readonly conversionTypes: string[],
    private readonly usedClickMetrics: string[],
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

    query = this.includeAdditionalTables(query)

    if (this._where.length > 0) {
      query += `\nwhere ${this._where.join(' and ')}`
    }

    if (this._groupBy.length > 0) {
      query += `\ngroup by ${this._groupBy.join(', ')}`
    }

    if (this._having.length > 0) {
      query += `\nhaving ${this._having.join(' and ')}`
    }

    if (this._orderBy) {
      const { field, order } = this._orderBy
      query += `\norder by "${field}" ${order}`
    }

    if (this._pagination) {
      const { limit, offset } = this._pagination
      query += `\noffset ${offset} limit ${limit}`
    }

    query = this.setTimeZone(query)

    return query
  }

  private includeAdditionalTables(query: string): string {
    if (this.tables.has(QueryTablesEnum.source)) {
      query += ` left join source on source.id = click."sourceId"`
    }

    if (this.tables.has(QueryTablesEnum.affiliateNetwork)) {
      query += ` left join "affiliate_network" "affiliateNetwork" on "affiliateNetwork".id = click."affiliateNetworkId"`
    }

    if (this.tables.has(QueryTablesEnum.campaign)) {
      query += ` left join "campaign" on "campaign".id = click."campaignId"`
    }

    if (this.tables.has(QueryTablesEnum.stream)) {
      query += ` left join "stream" on "stream".id = click."streamId"`
    }

    if (this.tables.has(QueryTablesEnum.offer)) {
      query += ` left join "offer" on "offer".id = click."offerId"`
    }

    return query
  }

  private setTimeZone(query: string): string {
    if (!query.includes(':timezone')) {
      return query
    }
    this.timeZonePlaceHolder ??= this.values.add(this.timeZone)
    query = query.replaceAll(':timezone', this.timeZonePlaceHolder)

    return query
  }

  private buildConversionQuery(): string | undefined {
    const columns: string[] = []

    for (const key of this.conversionTypes) {
      if (this.usedClickMetrics.includes(`conversions_${key}`)) {
        columns.push(
          `count(*) filter (where status = '${key}') as conversions_${key}`,
        )
      }

      if (this.usedClickMetrics.includes(`revenue_${key}`)) {
        columns.push(
          `sum(revenue) filter (where status = '${key}') as revenue_${key}`,
        )
      }
    }

    if (columns.length === 0) {
      return
    }

    const columnsStr = columns.join(', ')

    return `select "clickId", ${columnsStr} from conversion group by "clickId"`
  }

  public selectGroup(field: string, alias: string): void {
    this._selectGroup.push({ query: `"click"."${field}"`, alias })
    this._groupBy.push(`"click"."${field}"`)
  }

  public selectGroupRaw(
    query: string,
    alias: string,
    table?: QueryTablesEnum,
  ): void {
    this._selectGroup.push({ query, alias })
    this._groupBy.push(`"${alias}"`)
    if (table) {
      this.tables.add(table)
    }
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
    if (operator === 'between') {
      return this.havingBetween(query, value)
    }
    const { sqlOperator, preparedValue } = this.getSqlOperatorAndValue(
      operator,
      value,
    )

    const val = this.values.add(preparedValue)
    this._having.push(`${query} ${sqlOperator} ${val}`)
  }

  public where(
    query: string,
    operator: FilterOperatorEnum,
    value: unknown,
  ): this {
    if (operator === 'between') {
      throw new Error('No support between here')
    }
    if (operator === 'in') {
      return this.whereAny(query, value)
    }
    const { sqlOperator, preparedValue } = this.getSqlOperatorAndValue(
      operator,
      value,
    )
    const val = this.values.add(preparedValue)
    this._where.push(`${query} ${sqlOperator} ${val}`)

    return this
  }

  private whereAny(query: string, value: unknown): this {
    const val = this.values.add(value)
    this._where.push(`${query} = Any (${val})`)

    return this
  }

  private havingBetween(query: string, value: unknown): void {
    if (!Array.isArray(value)) {
      throw new Error('Value must be an array')
    }

    const val1 = this.values.add(value[0])
    const val2 = this.values.add(value[1])

    this._having.push(`${query} between ${val1} and ${val2}`)
  }

  private getSqlOperatorAndValue(
    operator: FilterOperatorEnum,
    value: unknown,
  ): { sqlOperator: string; preparedValue: unknown } {
    const operData = postgresOperationMap[operator]

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

    return {
      sqlOperator,
      preparedValue: val,
    }
  }

  public orderBy(field: string, order: 'asc' | 'desc'): void {
    this._orderBy = { field, order }
  }

  public execute(): Promise<Record<string, string>[]> {
    const query = this.buildClickQuery()
    // console.log(query)
    // console.log(this.values.values())

    return this.prisma.$queryRawUnsafe(query, ...this.values.values())
  }

  public async executeSummary(): Promise<{
    summary: Record<string, string>
    total: number
  }> {
    const metrics = this._selectMetric
      .map(
        ({ alias, summary }) =>
          `coalesce(${summary}(${alias})::numeric(12,2), 0) ${alias}`,
      )
      .join(', ')

    const query = `select count(*) as total, ${metrics} from (${this.buildClickQuery()}) summary`
    // console.log(query)
    // console.log(this.values.values())

    const result = await this.prisma.$queryRawUnsafe<Record<string, string>[]>(
      query,
      ...this.values.values(),
    )

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
