import { Injectable } from '@nestjs/common'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely, sql } from 'kysely'
import { DB } from '@generated/kysely'

export type IdentifierMap = Record<string, string>

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
      clicks_unique_global:
        'count(*) FILTER (WHERE click."isUniqueGlobal")::numeric(12,0)',
      clicks_unique_campaign:
        'count(*) FILTER (WHERE click."isUniqueCampaign")::numeric(12,0)',
      clicks_unique_stream:
        'count(*) FILTER (WHERE click."isUniqueStream")::numeric(12,0)',
      bots: 'count(*) FILTER (WHERE click."isBot")::numeric(12,0)',
      proxies: 'count(*) FILTER (WHERE click."isProxy")::numeric(12,0)',
      empty_referer:
        'count(*) FILTER (WHERE click."referer" IS NULL)::numeric(12,0)',
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
