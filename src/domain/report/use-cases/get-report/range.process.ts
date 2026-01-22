import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'
import { ReportRangeEnum } from '@/domain/report/types'
import { DateTime } from 'luxon'
import { BadRequestException } from '@nestjs/common'

type RangeArgs = {
  qb: PostgresRawReportQueryBuilder
  rangeInterval: ReportRangeEnum
  timezone: string
}

export class RangeProcess {
  private readonly qb: PostgresRawReportQueryBuilder
  private readonly rangeInterval: ReportRangeEnum
  private readonly timezone: string

  constructor(args: RangeArgs) {
    this.qb = args.qb
    this.rangeInterval = args.rangeInterval
    this.timezone = args.timezone
  }

  // eslint-disable-next-line complexity
  public process(from?: string, to?: string): void {
    switch (this.rangeInterval) {
      case ReportRangeEnum.today:
        return this.processToday()
      case ReportRangeEnum.yesterday:
        return this.processYesterday()
      case ReportRangeEnum.currentWeek:
        return this.processCurrentWeek()
      case ReportRangeEnum.last7Days:
        return this.processLast7Days()
      case ReportRangeEnum.currentMonth:
        return this.processCurrentMonth()
      case ReportRangeEnum.previousMonth:
        return this.processPreviousMonth()
      case ReportRangeEnum.last30Days:
        return this.processLast30Days()
      case ReportRangeEnum.currentYear:
        return this.processCurrentYear()
      case ReportRangeEnum.customDateRange:
        return this.processCustomDateRange(from, to)
      case ReportRangeEnum.customTimeRange:
        return this.processCustomTimeRange(from, to)
      case ReportRangeEnum.allTime:
        return
    }
    const rangeInterval: never = this.rangeInterval
    throw new BadRequestException('Unknown range interval ' + rangeInterval)
  }

  private processToday(): void {
    const dt = DateTime.now().setZone(this.timezone).startOf('day')

    this.qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<', dt.plus({ days: 1 }).toJSDate())
  }

  private processYesterday(): void {
    const dt = DateTime.now()
      .setZone(this.timezone)
      .startOf('day')
      .minus({ days: 1 })

    this.qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<', dt.plus({ days: 1 }).toJSDate())
  }

  private processCurrentWeek(): void {
    const dt = DateTime.now()
      .setZone(this.timezone)
      .setLocale('ru')
      .startOf('week')

    this.qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<', dt.plus({ week: 1 }).toJSDate())
  }

  private processLast7Days(): void {
    const dt = DateTime.now()

    this.qb.whereRaw(`"createdAt"`, '>=', dt.minus({ week: 1 }).toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<=', dt.toJSDate())
  }

  private processCurrentMonth(): void {
    const dt = DateTime.now().setZone(this.timezone).startOf('month')

    this.qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<', dt.plus({ month: 1 }).toJSDate())
  }

  private processPreviousMonth(): void {
    const dt = DateTime.now()
      .setZone(this.timezone)
      .startOf('month')
      .minus({ month: 1 })

    this.qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<', dt.plus({ month: 1 }).toJSDate())
  }

  private processLast30Days(): void {
    const dt = DateTime.now()

    this.qb.whereRaw(`"createdAt"`, '>=', dt.minus({ day: 30 }).toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<=', dt.toJSDate())
  }

  private processCurrentYear(): void {
    const dt = DateTime.now().setZone(this.timezone).startOf('year')

    this.qb.whereRaw(`"createdAt"`, '>=', dt.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<', dt.plus({ year: 1 }).toJSDate())
  }

  private processCustomDateRange(fromStr?: string, toStr?: string): void {
    const format = 'yyyy-MM-dd'

    const { from, to } = this.getDateTime(format, fromStr, toStr)

    this.qb.whereRaw(`"createdAt"`, '>=', from.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<', to.plus({ days: 1 }).toJSDate())
  }

  private processCustomTimeRange(fromStr?: string, toStr?: string): void {
    const format = 'yyyy-MM-dd HH:mm:ss'

    const { from, to } = this.getDateTime(format, fromStr, toStr)

    this.qb.whereRaw(`"createdAt"`, '>=', from.toJSDate())
    this.qb.whereRaw(`"createdAt"`, '<=', to.toJSDate())
  }

  private getDateTime(
    format: string,
    fromStr?: string,
    toStr?: string,
  ): { from: DateTime; to: DateTime } {
    this.ensureString(fromStr, 'from')
    this.ensureString(toStr, 'to')

    const from = this.strToDate(fromStr, format)
    const to = this.strToDate(toStr, format)

    return { from, to }
  }

  private strToDate(str: string, format: string): DateTime {
    const date = DateTime.fromFormat(str, format, {
      zone: this.timezone,
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
