import { PostgresRawReportQueryBuilder } from './postgres-raw-report-query-builder'
import { FilterOperatorEnum, ReportRangeEnum } from '../types'
import { DateTime } from 'luxon'
import { BadRequestException } from '@nestjs/common'
import { isNullable } from '@/shared/helpers'

type RangeArgs = {
  qb: PostgresRawReportQueryBuilder
  rangeInterval: ReportRangeEnum
  timezone: string
}

type WhereRawOne = [operator: FilterOperatorEnum, value: unknown]
type WhereRaw = [first: WhereRawOne, second: WhereRawOne]

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

    this.whereRange([
      ['>=', dt.toJSDate()],
      ['<', dt.plus({ days: 1 }).toJSDate()],
    ])
  }

  private processYesterday(): void {
    const dt = DateTime.now()
      .setZone(this.timezone)
      .startOf('day')
      .minus({ days: 1 })

    this.whereRange([
      ['>=', dt.toJSDate()],
      ['<', dt.plus({ days: 1 }).toJSDate()],
    ])
  }

  private processCurrentWeek(): void {
    const dt = DateTime.now()
      .setZone(this.timezone)
      .setLocale('ru')
      .startOf('week')

    this.whereRange([
      ['>=', dt.toJSDate()],
      ['<', dt.plus({ week: 1 }).toJSDate()],
    ])
  }

  private processLast7Days(): void {
    const dt = DateTime.now()

    this.whereRange([
      ['>=', dt.minus({ week: 1 }).toJSDate()],
      ['<=', dt.toJSDate()],
    ])
  }

  private processCurrentMonth(): void {
    const dt = DateTime.now().setZone(this.timezone).startOf('month')

    this.whereRange([
      ['>=', dt.toJSDate()],
      ['<', dt.plus({ month: 1 }).toJSDate()],
    ])
  }

  private processPreviousMonth(): void {
    const dt = DateTime.now()
      .setZone(this.timezone)
      .startOf('month')
      .minus({ month: 1 })

    this.whereRange([
      ['>=', dt.toJSDate()],
      ['<', dt.plus({ month: 1 }).toJSDate()],
    ])
  }

  private processLast30Days(): void {
    const dt = DateTime.now()

    this.whereRange([
      ['>=', dt.minus({ day: 30 }).toJSDate()],
      ['<=', dt.toJSDate()],
    ])
  }

  private processCurrentYear(): void {
    const dt = DateTime.now().setZone(this.timezone).startOf('year')

    this.whereRange([
      ['>=', dt.toJSDate()],
      ['<', dt.plus({ year: 1 }).toJSDate()],
    ])
  }

  private processCustomDateRange(fromStr?: string, toStr?: string): void {
    const format = 'yyyy-MM-dd'

    const { from, to } = this.getDateTime(format, fromStr, toStr)

    this.whereRange([
      ['>=', from.toJSDate()],
      ['<', to.plus({ days: 1 }).toJSDate()],
    ])
  }

  private processCustomTimeRange(fromStr?: string, toStr?: string): void {
    const format = 'yyyy-MM-dd HH:mm:ss'

    const { from, to } = this.getDateTime(format, fromStr, toStr)

    this.whereRange([
      ['>=', from.toJSDate()],
      ['<=', to.toJSDate()],
    ])
  }

  private whereRange(params: WhereRaw): void {
    const [[o1, v1], [o2, v2]] = params
    this.qb.where(`"createdAt"`, o1, v1)
    this.qb.where(`"createdAt"`, o2, v2)
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
    if (isNullable(value)) {
      throw new Error(`Value for ${name} is not string`)
    }
  }
}
