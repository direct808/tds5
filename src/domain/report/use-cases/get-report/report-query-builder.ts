import { Kysely, sql } from 'kysely'
import { DB } from '@generated/kysely'
import toSnakeCase from 'to-snake-case'
import { FilterOperatorEnum } from '@/domain/report/types'

export class ReportQueryBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private qb: any
  private conversionTypes: string[] | null = null

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

  public static create(db: Kysely<DB>): ReportQueryBuilder {
    return new this(db)
  }

  private constructor(private db: Kysely<DB>) {
    this.qb = this.db.selectFrom('click')
  }

  public setPagination(offset: number, limit: number): void {
    this.qb = this.qb.offset(offset).limit(limit)
  }

  public selectSourceName(): this {
    return this.selectNameFrom('source')
  }

  public selectCampaignName(): this {
    return this.selectNameFrom('campaign')
  }

  public selectStreamName(): this {
    return this.selectNameFrom('stream')
  }

  public selectOfferName(): this {
    return this.selectNameFrom('offer')
  }

  public selectAffiliateNetworkName(): this {
    return this.selectNameFrom('affiliateNetwork')
  }

  private selectNameFrom(name: string): this {
    const snaked = toSnakeCase(name)
    this.qb = this.qb.leftJoin(snaked, `click.${name}Id`, `${snaked}.id`)
    this.qb = this.qb
      .select(sql.raw(`${snaked}.name`).as(name))
      .groupBy(`${snaked}.name`)

    return this
  }

  public includeConversionFields(fields: string[]): void {
    const conversionTypes = this.getConversionTypes()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sel: any[] = [] // todo убрать any
    for (const key of conversionTypes) {
      if (fields.includes('conversions_' + key)) {
        const conv = this.db.fn
          .countAll()
          .filterWhere('status', '=', key)
          .as('conversions_' + key)
        sel.push(conv)
      }

      if (fields.includes('revenue_' + key)) {
        const rev =
          sql<number>`${this.db.fn.sum('revenue').filterWhere('status', '=', key)}::numeric(12,2)`.as(
            'revenue_' + key,
          )
        sel.push(rev)
      }
    }

    if (sel.length === 0) {
      return
    }

    const subquery = this.db
      .selectFrom('conversion')
      .select('clickId')
      .groupBy('clickId')
      .select(() => sel)

    this.qb = this.qb.leftJoin(subquery.as('c'), 'c.clickId', 'click.id')
  }

  private getConversionTypes(): string[] {
    if (!this.conversionTypes) {
      throw new Error('No conversion types')
    }

    return this.conversionTypes
  }

  public setConversionTypes(types: string[]): this {
    this.conversionTypes = types

    return this
  }

  public select(field: string): this {
    this.qb = this.qb.select('click.' + field)

    return this
  }

  public having(
    query: string,
    operator: FilterOperatorEnum,
    value: unknown,
  ): this {
    if (operator === FilterOperatorEnum.between) {
      return this.havingBetween(query, value)
    }
    const { sqlOperator, preparedValue } = this.getSqlOperatorAndValue(
      operator,
      value,
    )
    this.qb = this.qb.having(sql.raw(`${query}`), sqlOperator, preparedValue)

    return this
  }

  public where(
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
    this.qb = this.qb.where(sql.raw(`${query}`), sqlOperator, preparedValue)

    return this
  }

  private whereBetween(query: string, value: unknown): this {
    if (!Array.isArray(value)) {
      throw new Error('Value must be an array')
    }
    this.qb = this.qb.where(sql.raw(`${query}`), '>=', value[0])
    this.qb = this.qb.where(sql.raw(`${query}`), '<=', value[1])

    return this
  }

  private havingBetween(query: string, value: unknown): this {
    if (!Array.isArray(value)) {
      throw new Error('Value must be an array')
    }
    this.qb = this.qb.having(sql.raw(`${query}`), '>=', value[0])
    this.qb = this.qb.having(sql.raw(`${query}`), '<=', value[1])

    return this
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

    return {
      sqlOperator,
      preparedValue: val,
    }
  }

  public selectRaw(query: string, alias: string): this {
    this.qb = this.qb.select(sql.raw(query).as(alias))

    return this
  }

  public groupBy(field: string): this {
    this.qb = this.qb.groupBy(field)

    return this
  }

  public orderBy(field: string, order: 'asc' | 'desc'): this {
    this.qb = this.qb.orderBy(field, order)

    return this
  }

  public groupByClickField(field: string): this {
    this.qb = this.qb.groupBy(`click.${field}`)

    return this
  }

  public sql(): string {
    const data = this.qb.compile()

    return data.sql
  }

  public execute(): Promise<Record<string, string | number>[]> {
    return this.qb.execute()
  }

  public async executeSummary(): Promise<{
    summary: Record<string, string | number>
    total: string
  }> {
    const { total, ...summary } = await this.qb
      .select(sql.raw('count(*) as total'))
      .executeTakeFirst()

    return {
      summary,
      total,
    }
  }
}
