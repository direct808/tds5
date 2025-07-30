import {
  DateIntervalFilter,
  DateIntervalFilterObject,
} from './date-interval-filter'
import { DateTime } from 'luxon'

describe('DateIntervalFilter', () => {
  describe('diffDates', () => {
    afterEach(() => {
      jest.useRealTimers()
    })

    it('Should return true, if now in range', () => {
      const mockNow = DateTime.fromISO('2025-07-04T10:00:00', {
        zone: 'Europe/Moscow',
      }).toJSDate()

      jest.useFakeTimers().setSystemTime(mockNow)

      const from = '2025-07-04T09:00:00'
      const to = '2025-07-04T11:00:00'
      const timezone = 'Europe/Moscow'

      const filter = new DateIntervalFilter({
        from,
        to,
        timezone,
      } as DateIntervalFilterObject)

      const result = filter['handle']()

      expect(result).toBe(true)
    })

    it('Should return false, if now before from', () => {
      const mockNow = DateTime.fromISO('2025-07-04T08:00:00', {
        zone: 'Europe/Moscow',
      }).toJSDate()

      jest.useFakeTimers().setSystemTime(mockNow)

      const from = '2025-07-04T09:00:00'
      const to = '2025-07-04T11:00:00'
      const timezone = 'Europe/Moscow'

      const filter = new DateIntervalFilter({
        from,
        to,
        timezone,
      } as DateIntervalFilterObject)

      const result = filter['handle']()

      expect(result).toBe(false)
    })

    it('Should return false, if now is later than to', () => {
      const mockNow = DateTime.fromISO('2025-07-04T12:00:00', {
        zone: 'Europe/Moscow',
      }).toJSDate()

      jest.useFakeTimers().setSystemTime(mockNow)

      const from = '2025-07-04T09:00:00'
      const to = '2025-07-04T11:00:00'
      const timezone = 'Europe/Moscow'

      const filter = new DateIntervalFilter({
        from,
        to,
        timezone,
      } as DateIntervalFilterObject)

      const result = filter['handle']()

      expect(result).toBe(false)
    })

    it('Should return true if date is in range including zone', () => {
      const mockNow = DateTime.fromISO('2025-07-04T06:00:00', {
        zone: 'UTC+1',
      }).toJSDate()

      jest.useFakeTimers().setSystemTime(mockNow)

      const from = '2025-07-04T07:00:00'
      const to = '2025-07-04T08:00:00'
      const timezone = 'UTC+3'

      const filter = new DateIntervalFilter({
        from,
        to,
        timezone,
      } as DateIntervalFilterObject)

      const result = filter['handle']()

      expect(result).toBe(true)
    })
  })
})
