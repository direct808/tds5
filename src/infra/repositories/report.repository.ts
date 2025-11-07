import { Injectable } from '@nestjs/common'
import { InjectKysely } from 'nestjs-kysely'
import { AliasedRawBuilder, Kysely, SelectQueryBuilder, sql } from 'kysely'
import { DB } from '@/shared/db'
import { AliasedAggregateFunctionBuilder } from 'kysely/dist/cjs/query-builder/aggregate-function-builder'

export type IdentifierMap = Record<string, string>

export type GetReportArgs = {
  metrics: string[]
  groups?: string[]
}

type HZ =
  | AliasedRawBuilder<number, string>
  | AliasedAggregateFunctionBuilder<
      DB,
      keyof DB,
      number | string | bigint,
      string
    >

@Injectable()
export class ReportRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  public async setTimezone(timezone: string): Promise<void> {
    await sql`SET TIME ZONE ${sql.lit(timezone)}`.execute(this.db)
  }

  public getIdentifierMap(): IdentifierMap {
    return {
      clicks: 'count(*)::numeric(12,0)',
      cost: 'sum(click.cost)::numeric(12,2)',
      clicks_unique_global: 'count(distinct "visitorId")::numeric(12,0)',
      clicks_unique_campaign:
        'count(distinct("visitorId", "campaignId"))::numeric(12,0)',
      clicks_unique_stream:
        'count(distinct("visitorId", "streamId"))::numeric(12,0)',
      bots: 'count(*) FILTER (WHERE "isBot")::numeric(12,0)',
      proxies: 'count(*) FILTER (WHERE "isProxy")::numeric(12,0)',
      empty_referer: 'count(*) FILTER (WHERE "referer" IS NULL)::numeric(12,0)',
    }
  }

  public addSelect(
    qb: SelectQueryBuilder<any, any, any>,
    query: string,
    metric: string,
    decimals: number,
  ): SelectQueryBuilder<any, any, any> {
    query += `::numeric(12,${decimals})`
    qb = qb.select([sql.raw<number>(query).as(metric)])

    return qb
  }

  public addConversionsIdentifiers(
    identifierMap: IdentifierMap,
    keys: string[],
  ): void {
    for (const key of keys) {
      identifierMap[`conversions_${key}`] =
        `sum(c.conversions_${key})::numeric(12,0)`
      identifierMap[`revenue_${key}`] = `sum(c.revenue_${key})::numeric(12,2)`
    }
  }

  public joinConversions(
    usedIdentifiers: string[],
    keys: string[],
  ): SelectQueryBuilder<any, any, any> | null {
    const sel: HZ[] = []

    for (const key of keys) {
      if (usedIdentifiers.includes('conversions_' + key)) {
        sel.push(
          this.db.fn
            .countAll()
            .filterWhere('status', '=', key)
            .as('conversions_' + key),
        )
      }

      if (usedIdentifiers.includes('revenue_' + key)) {
        sel.push(
          sql<number>`${this.db.fn.sum('revenue').filterWhere('status', '=', key)}::numeric(12,2)`.as(
            'revenue_' + key,
          ),
        )
      }
    }

    if (sel.length === 0) {
      return null
    }

    return this.db
      .selectFrom('conversion')
      .select('clickId')
      .groupBy('clickId')
      .select(() => sel)
  }
}
