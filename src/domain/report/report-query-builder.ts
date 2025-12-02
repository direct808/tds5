import { Kysely, sql } from 'kysely'
import { DB } from '@generated/kysely'
import toSnakeCase from 'to-snake-case'

export class ReportQueryBuilder {
  private qb: any
  private conversionTypes: string[] | null = null

  public static create(db: Kysely<DB>): ReportQueryBuilder {
    return new this(db)
  }

  private constructor(private db: Kysely<DB>) {
    this.qb = this.db.selectFrom('click')
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
    const sel: any[] = []
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
    operator: string,
    value: number | string | boolean,
  ): this {
    this.qb = this.qb.having(sql.raw(`${query}`), operator, value)

    return this
  }

  public where(query: string, operator: string, value: unknown): this {
    this.qb = this.qb.where(sql.raw(`${query}`), operator, value)

    return this
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

  public execute(): Promise<Record<string, string | number>> {
    return this.qb.execute()
  }
}
