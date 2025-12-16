import { DateTime } from 'luxon'
import {
  BaseFilterObject,
  StreamFilter,
} from '@/domain/click/stream/filter/types'

export interface DateIntervalFilterObject extends BaseFilterObject {
  type: 'date-interval'
  from: string
  to: string
  timezone: string
}

export class DateIntervalFilter implements StreamFilter {
  constructor(private readonly filterObj: DateIntervalFilterObject) {}

  handle: StreamFilter['handle'] = () => {
    const { from, to, timezone } = this.filterObj
    const now = DateTime.now().setZone(timezone)

    const fromDate = DateTime.fromISO(from, { zone: timezone })
    const toDate = DateTime.fromISO(to, { zone: timezone })

    return now >= fromDate && now <= toDate
  }
}
