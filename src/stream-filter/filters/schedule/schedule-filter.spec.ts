import { DateTime } from 'luxon'
import { ScheduleFilter, ScheduleFilterObj } from './schedule-filter'

describe('schedule-filter.ts', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  describe('checkSchedule', () => {
    it.each([
      ['2024-07-02T11:00:00', 2, '10:30', 2, '11:30', true],
      ['2024-07-02T12:30:00', 2, '10:30', 2, '11:30', false],

      ['2024-07-02T12:30:00', 1, '10:30', 3, '11:30', true],
      ['2024-07-03T12:30:00', 1, '10:30', 3, '11:30', false],

      ['2024-07-02T09:00:00', 1, '13:00', 3, '10:00', true],
      ['2024-07-03T11:00:00', 1, '13:00', 3, '10:00', false],

      ['2024-07-04T09:00:00', 3, '13:00', 1, '10:00', true],
      ['2024-07-04T11:00:00', 3, '13:00', 1, '10:00', true],

      ['2024-07-03T11:00:00', 3, '10:00', 1, '13:00', true],
      ['2024-07-03T09:00:00', 3, '10:00', 1, '13:00', false],

      ['2024-07-02T09:00:00', 3, '10:00', 1, '13:00', false],
    ])(
      'checkSchedule %s %s %s %s %s %s',
      (now, fromDay, formTime, toDay, toTime, expected) => {
        const timezone = 'Europe/Moscow'
        const mockNow = DateTime.fromISO(now, {
          zone: timezone,
        }).toJSDate()

        jest.useFakeTimers().setSystemTime(mockNow)

        const obj = {
          type: 'schedule',
          timezone,
          items: [{ fromDay, formTime, toDay, toTime }],
        } as ScheduleFilterObj

        const filter = new ScheduleFilter(obj)

        const result = filter.handle()

        expect(result).toEqual(expected)
      },
    )
  })

  describe('checkDayRange', () => {
    it.each([
      [2, 4, 2, true],
      [2, 4, 3, true],
      [2, 4, 4, true],
      [2, 4, 1, false],
      [2, 4, 5, false],

      [4, 2, 2, true],
      [4, 2, 3, false],
      [4, 2, 4, true],
      [4, 2, 1, true],
      [4, 2, 5, true],
    ])(
      'checkDayRange fromDay=%s, toDay=%s, current=%s, expected=%s',
      (fromDay, toDay, current, expected) => {
        const filter = new ScheduleFilter({} as ScheduleFilterObj)

        const result = filter['checkDayRange'](fromDay, toDay, current)

        expect(result).toEqual(expected)
      },
    )
  })
})
