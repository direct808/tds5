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
}
