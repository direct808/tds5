import {
  BaseFilterObject,
  StreamFilter,
} from '@/domain/click/stream/filter/types'
import { DateTime } from 'luxon'

interface Item {
  fromDay: number
  formTime: string
  toDay: number
  toTime: string
}

export interface ScheduleFilterObj extends BaseFilterObject {
  type: 'schedule'
  timezone: string
  items: Item[]
}

type GetTimeResult = { fromTimeMinutes: number; toTimeMinutes: number }

export class ScheduleFilter implements StreamFilter {
  constructor(private filterObj: ScheduleFilterObj) {}

  handle: StreamFilter['handle'] = () => {
    const now = DateTime.now().setZone(this.filterObj.timezone)
    const currentWeekDay = now.weekday // 1 (Monday) - 7 (Sunday)
    const currentTimeMinutes = now.hour * 60 + now.minute

    for (const item of this.filterObj.items) {
      if (this.checkScheduleItem(item, currentWeekDay, currentTimeMinutes)) {
        return true
      }
    }

    return false
  }

  private checkScheduleItem(
    { fromDay, toDay, formTime, toTime }: Item,
    currentWeekDay: number,
    currentTimeMinutes: number,
  ): boolean {
    const { fromTimeMinutes, toTimeMinutes } = this.getTime(formTime, toTime)

    const dayInRange = this.checkDayRange(fromDay, toDay, currentWeekDay)

    if (!dayInRange) {
      return false
    }

    if (currentWeekDay === fromDay && currentTimeMinutes < fromTimeMinutes) {
      return false
    }

    if (currentWeekDay === toDay && currentTimeMinutes > toTimeMinutes) {
      return false
    }

    return true
  }

  private getTime(formTime: string, toTime: string): GetTimeResult {
    const [fromHour, fromMinute] = this.splitTime(formTime)
    const [toHour, toMinute] = this.splitTime(toTime)
    const fromTimeMinutes = fromHour * 60 + fromMinute
    const toTimeMinutes = toHour * 60 + toMinute

    return { fromTimeMinutes, toTimeMinutes }
  }

  private splitTime(time: string): [number, number] {
    const [hour, minute] = time.split(':')

    if (!hour || !minute) {
      throw new Error('No hour ot minute')
    }

    return [+hour, +minute]
  }

  private checkDayRange(
    fromDay: number,
    toDay: number,
    current: number,
  ): boolean {
    if (fromDay <= toDay) {
      if (current >= fromDay && current <= toDay) {
        return true
      }
    }

    if (fromDay > toDay) {
      if (current >= fromDay || current <= toDay) {
        return true
      }
    }

    return false
  }
}
