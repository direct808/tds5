import { ReportColumnService } from './report-column.service'
import { FORMULA_NAMES } from '@/domain/report/formulas'
import { METRIC_NAMES } from '@/domain/report/metrics'

describe('ReportColumnService', () => {
  let service: ReportColumnService

  beforeEach(() => {
    service = new ReportColumnService()
  })

  describe('getMetricsNames', () => {
    it('should return all columns with default=false when defaults is empty', () => {
      const result = service.getMetricsNames(new Set())

      const allKeys = [
        ...Object.keys(FORMULA_NAMES),
        ...Object.keys(METRIC_NAMES),
      ]

      expect(result).toHaveLength(allKeys.length)
      expect(result.every((col) => !col.default)).toBe(true)
    })

    it('should mark specified columns as default=true', () => {
      const result = service.getMetricsNames(new Set(['clicks', 'revenue']))

      const clicksCol = result.find((col) => col.column === 'clicks')
      const revenueCol = result.find((col) => col.column === 'revenue')
      const otherCol = result.find((col) => col.column === 'cost')

      expect(clicksCol?.default).toBe(true)
      expect(revenueCol?.default).toBe(true)
      expect(otherCol?.default).toBe(false)
    })

    it('should throw an error when defaults contains unknown column key', () => {
      expect(() =>
        service.getMetricsNames(new Set(['unknown_column'])),
      ).toThrow('Unknown default columns: unknown_column')
    })
  })
})
