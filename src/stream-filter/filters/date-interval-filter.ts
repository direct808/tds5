import { DateIntervalFilterObject, StreamFilter } from '@/stream-filter/types'
import { DateTime } from 'luxon'

export class DateIntervalFilter implements StreamFilter {
  constructor(private readonly filterObj: DateIntervalFilterObject) {}

  handle(): boolean {
    const { from, to, timezone } = this.filterObj
    return this.diffDates(from, to, timezone)
  }

  private diffDates(from: string, to: string, timezone: string): boolean {
    const now = DateTime.now().setZone(timezone)

    const fromDate = DateTime.fromISO(from, { zone: timezone })
    const toDate = DateTime.fromISO(to, { zone: timezone })

    return now >= fromDate && now <= toDate
  }
}
