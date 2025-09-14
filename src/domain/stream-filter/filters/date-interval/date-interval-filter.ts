import { DateTime } from 'luxon'
import { BaseFilterObject, StreamFilter } from '@/domain/stream-filter/types'

export interface DateIntervalFilterObject extends BaseFilterObject {
  type: 'date-interval'
  from: string
  to: string
  timezone: string
}

export class DateIntervalFilter implements StreamFilter {
  constructor(private readonly filterObj: DateIntervalFilterObject) {}

  public handle(): boolean {
    const { from, to, timezone } = this.filterObj
    const now = DateTime.now().setZone(timezone)

    const fromDate = DateTime.fromISO(from, { zone: timezone })
    const toDate = DateTime.fromISO(to, { zone: timezone })

    return now >= fromDate && now <= toDate
  }
}
