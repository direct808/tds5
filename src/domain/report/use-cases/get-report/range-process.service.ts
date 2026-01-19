import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'
import { ReportRangeEnum } from '@/domain/report/types'

export class RangeProcessService {
  public process(
    qb: PostgresRawReportQueryBuilder,
    rangeInterval: ReportRangeEnum,
    from?: Date,
    to?: Date,
  ): void {
    switch (rangeInterval) {
      case ReportRangeEnum.custom_date_range:
      case ReportRangeEnum.custom_time_range:
        return this.processCustomDateRange(qb, from, to)
    }
  }

  private processCustomDateRange(
    qb: PostgresRawReportQueryBuilder,
    from?: Date,
    to?: Date,
  ): void {
    if (!from) {
      throw new Error('No from')
    }
    if (!to) {
      throw new Error('No to')
    }

    qb.whereBetween(`"createdAt" at time zone 'UTC' at time zone :timezone`, [
      from,
      to,
    ])
  }
}
