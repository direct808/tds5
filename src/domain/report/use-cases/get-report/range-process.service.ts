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
      case ReportRangeEnum.today:
        return this.processToday(qb, timezone)
      case ReportRangeEnum.yesterday:
        return this.processYesterday(qb, timezone)
      case ReportRangeEnum.customDateRange:
        return this.processCustomDateRange(qb, timezone, from, to)
      case ReportRangeEnum.customTimeRange:
        return this.processCustomTimeRange(qb, timezone, from, to)
    }
  }

  private processToday(
    qb: PostgresRawReportQueryBuilder,
    timezone: string,
  ): void {
    const dt = DateTime.now().setZone(timezone).startOf('day')

    qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    qb.whereRaw(`"createdAt"`, '<', dt.plus({ days: 1 }).toJSDate())
  }

  private processYesterday(
    qb: PostgresRawReportQueryBuilder,
    timezone: string,
  ): void {
    const dt = DateTime.now()
      .setZone(timezone)
      .startOf('day')
      .minus({ days: 1 })

    qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    qb.whereRaw(`"createdAt"`, '<', dt.plus({ days: 1 }).toJSDate())
  }

  private processCustomDateRange(
    qb: PostgresRawReportQueryBuilder,
    timezone: string,
    fromStr?: string,
    toStr?: string,
  ): void {
    const format = 'yyyy-MM-dd'

    const { from, to } = this.getDateTime(format, timezone, fromStr, toStr)

    qb.whereRaw(`"createdAt"`, '>=', from.toJSDate())
    qb.whereRaw(`"createdAt"`, '<', to.plus({ days: 1 }).toJSDate())
  }

  private processCustomTimeRange(
    qb: PostgresRawReportQueryBuilder,
    timezone: string,
    fromStr?: string,
    toStr?: string,
  ): void {
    const format = 'yyyy-MM-dd HH:mm:ss'

    const { from, to } = this.getDateTime(format, timezone, fromStr, toStr)

    qb.whereRaw(`"createdAt"`, '>=', from.toJSDate())
    qb.whereRaw(`"createdAt"`, '<=', to.toJSDate())
  }

  private getDateTime(
    format: string,
    timezone: string,
    fromStr?: string,
    toStr?: string,
  ): { from: DateTime; to: DateTime } {
    this.ensureString(fromStr, 'from')
    this.ensureString(toStr, 'to')

    const from = this.strToDate(fromStr, format, timezone)
    const to = this.strToDate(toStr, format, timezone)

    return { from, to }
  }

  private strToDate(str: string, format: string, timezone: string): DateTime {
    const date = DateTime.fromFormat(str, format, {
      zone: timezone,
    })

    if (!date.isValid) {
      throw new BadRequestException('Bad format ' + str)
    }

    return date
  }

  private ensureString(
    value: string | undefined,
    name: string,
  ): asserts value is string {
    if (!value) {
      throw new Error(`Value for ${name} is empty`)
    }
  }
}
