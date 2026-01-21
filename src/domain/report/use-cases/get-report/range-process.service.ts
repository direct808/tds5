import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'
import { ReportRangeEnum } from '@/domain/report/types'
import { DateTime } from 'luxon'
import { BadRequestException } from '@nestjs/common'

export class RangeProcessService {
  public process(
    qb: PostgresRawReportQueryBuilder,
    rangeInterval: ReportRangeEnum,
    timezone: string,
    from?: string,
    to?: string,
  ): void {
    switch (rangeInterval) {
      case ReportRangeEnum.custom_date_range:
      case ReportRangeEnum.custom_time_range:
        return this.processCustomDateRange(qb, timezone, from, to)
    }
  }

  private processCustomDateRange(
    qb: PostgresRawReportQueryBuilder,
    timezone: string,
    fromStr?: string,
    toStr?: string,
  ): void {
    if (!fromStr) {
      throw new Error('No from')
    }
    if (!toStr) {
      throw new Error('No to')
    }

    const from = DateTime.fromFormat(fromStr, 'yyyy-MM-dd', {
      zone: timezone,
    })
    const to = DateTime.fromFormat(toStr, 'yyyy-MM-dd', {
      zone: timezone,
    }).plus({ days: 1 })

    if (!from.isValid) {
      throw new BadRequestException('Bad from format')
    }

    if (!to.isValid) {
      throw new BadRequestException('Bad from to')
    }

    qb.whereRaw(`"createdAt"`, '>=', from.toJSDate())
    qb.whereRaw(`"createdAt"`, '<', to.toJSDate())
  }
}
