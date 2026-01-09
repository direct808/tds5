import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'
import { FilterOperatorEnum, ReportRangeEnum } from '@/domain/report/types'

export class RangeProcessService {
  public process(
    qb: PostgresRawReportQueryBuilder,
    rangeInterval: ReportRangeEnum,
    from?: Date,
    to?: Date,
  ) {
    switch (rangeInterval) {
      case ReportRangeEnum.custom_date_range:
        return this.processCustomDateRange(qb, from, to)
    }
  }

  private processCustomDateRange(
    qb: PostgresRawReportQueryBuilder,
    from?: Date,
    to?: Date,
  ) {
    if (!from) {
      throw new Error('No from')
    }
    if (!to) {
      throw new Error('No to')
    }

    qb.whereGroup('"createdAt"', FilterOperatorEnum['>'], from)
    qb.whereGroup('"createdAt"', FilterOperatorEnum['<='], to)
  }
}
