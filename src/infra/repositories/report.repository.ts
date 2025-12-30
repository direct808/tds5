import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'

export type ClickMetricMap = Record<string, string>

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  public addConversionsClickMetrics(
    clickMetricMap: ClickMetricMap,
    keys: string[],
  ): void {
    for (const key of keys) {
      clickMetricMap[`conversions_${key}`] = `sum(c.conversions_${key})`
      clickMetricMap[`revenue_${key}`] = `coalesce(sum(c.revenue_${key}), 0)`
    }
  }
}
