import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'

export type IdentifierMap = Record<string, string>

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  public getIdentifierMap(): IdentifierMap {
    return {
      clicks: 'count(*)::numeric(12,0)',
      cost: 'coalesce(sum(click.cost), 0)::numeric(12,2)',
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
      identifierMap[`conversions_${key}`] = `sum(c.conversions_${key})`
      identifierMap[`revenue_${key}`] = `coalesce(sum(c.revenue_${key}), 0)`
    }
  }
}
