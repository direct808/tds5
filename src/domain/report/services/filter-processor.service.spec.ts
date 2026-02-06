import { FilterProcessorService } from '@/domain/report/services/filter-processor.service'
import { PostgresRawReportQueryBuilder } from '@/domain/report/services/postgres-raw-report-query-builder'
import { ClickMetricMap } from '@/infra/repositories/report.repository'
import { spyOn } from '../../../../test/utils/helpers'

describe('FilterProcessorService', () => {
  const having = jest.fn()
  const where = jest.fn()
  const qb = { having, where } as Pick<
    PostgresRawReportQueryBuilder,
    'having' | 'where'
  > as PostgresRawReportQueryBuilder
  let service: FilterProcessorService
  const clickMetricMap = {} as ClickMetricMap

  beforeEach(() => {
    jest.resetAllMocks()
    service = new FilterProcessorService()
  })

  it('ok', () => {
    const processItem = spyOn(service, 'processItem')

    service.process(qb, clickMetricMap, [
      ['year', '=', 2],
      ['year', '>', 2],
    ])

    expect(processItem).toHaveBeenCalledTimes(2)
  })

  it('Unknown metric', () => {
    const fn = () => service.process(qb, clickMetricMap, [['Bad', 'in', 2]])

    expect(fn).toThrow("Unknown field: 'Bad'")
  })

  it('processItemFormula', () => {
    const clickMetricMap = {
      conversions_registration: 'conversions_registration',
      clicks_unique_global: 'clicks_unique_global',
    } as ClickMetricMap

    const checkFilterData = spyOn(service, 'checkFilterData')

    service.process(qb, clickMetricMap, [['ucr', '=', 2]])

    expect(checkFilterData).toHaveBeenCalledTimes(1)
    expect(having).toHaveBeenCalledTimes(1)
  })

  it('processItemclickMetric', () => {
    const clickMetricMap = { ident: 'ident' } as ClickMetricMap
    const checkFilterData = spyOn(service, 'checkFilterData')

    service.process(qb, clickMetricMap, [['ident', '=', 2]])

    expect(checkFilterData).toHaveBeenCalledTimes(1)
    expect(having).toHaveBeenCalledTimes(1)
  })

  describe('processItemGroup', () => {
    it('ok', () => {
      const checkFilterData = spyOn(service, 'checkFilterData')

      service.process(qb, clickMetricMap, [['country', '=', 'us']])

      expect(checkFilterData).toHaveBeenCalledTimes(1)
      expect(where).toHaveBeenCalledTimes(1)
    })

    it('disableFilter', () => {
      const fn = () =>
        service.process(qb, clickMetricMap, [['sourceName', '=', 'us']])

      expect(fn).toThrow(`Filter disable for field 'sourceName'`)
    })
  })

  describe('checkOperator', () => {
    it('Unsupported operator', () => {
      const fn = () =>
        service.process(qb, clickMetricMap, [['year', 'hz' as any, 2010]])

      expect(fn).toThrow("Unsupported operator 'hz'")
    })

    it('Operator not support for type', () => {
      const fn = () =>
        service.process(qb, clickMetricMap, [['year', 'contains', 2010]])

      expect(fn).toThrow("Operator not support for type 'number'")
    })
  })
})
