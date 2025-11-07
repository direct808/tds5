import { Kysely, sql } from 'kysely/dist/esm'
import { DB } from '@/shared/db'
import { SelectQueryBuilder } from 'kysely'

export class ReportQueryBuilder {
  private qb: SelectQueryBuilder<any, any, any>
  private conversionTypes: string[] | null = null

  public static create(db: Kysely<DB>): ReportQueryBuilder {
    return new this(db)
  }

  private constructor(private db: Kysely<DB>) {
    this.qb = this.db.selectFrom('click')
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

  public select(field: string): this {
    this.qb = this.qb.select(field)

    return this
  }

  public selectRaw<T>(query: string, alias: string): this {
    this.qb = this.qb.select(sql.raw<T>(query).as(alias))

    return this
  }

  public groupBy(field: string): this {
    this.qb = this.qb.groupBy(field)

    return this
  }
}
