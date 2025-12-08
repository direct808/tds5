import { FilterProcessorService } from '@/domain/report/use-cases/get-report/filter-processor.service'
import { ReportQueryBuilder } from '@/domain/report/report-query-builder'
import { FilterOperatorEnum as Operators } from '@/domain/report/types'
import { IdentifierMap } from '@/infra/repositories/report.repository'
import { spyOn } from '../../../../../test/utils/helpers'

describe('FilterProcessorService', () => {
  const having = jest.fn()
  const where = jest.fn()
  const qb = { having, where } as unknown as ReportQueryBuilder
  let service: FilterProcessorService
  const identifierMap = {} as IdentifierMap

  beforeEach(() => {
    jest.resetAllMocks()
    service = new FilterProcessorService()
  })

  it('ok', () => {
    const processItem = spyOn(service, 'processItem')

    service.process(qb, identifierMap, [
      ['year', Operators['='], 2],
      ['year', Operators['>'], 2],
    ])

    expect(processItem).toHaveBeenCalledTimes(2)
  })

  it('Unknown metric', () => {
    const fn = () =>
      service.process(qb, identifierMap, [['Bad', Operators.in, 2]])

    expect(fn).toThrow("Unknown field: 'Bad'")
  })

  it('processItemFormula', () => {
    const identifierMap = {
      conversions_registration: 'conversions_registration',
      clicks_unique_global: 'clicks_unique_global',
    } as IdentifierMap

    const checkFilterData = spyOn(service, 'checkFilterData')

    service.process(qb, identifierMap, [['ucr', Operators['='], 2]])

    // expect(fn).toThrow("Unknown field: 'Bad'")
    expect(checkFilterData).toHaveBeenCalledTimes(1)
    expect(having).toHaveBeenCalledTimes(1)
  })

  it('processItemIdentifier', () => {
    const identifierMap = { ident: 'ident' } as IdentifierMap
    const checkFilterData = spyOn(service, 'checkFilterData')

    service.process(qb, identifierMap, [['ident', Operators['='], 2]])

    expect(checkFilterData).toHaveBeenCalledTimes(1)
    expect(having).toHaveBeenCalledTimes(1)
  })

  describe('processItemGroup', () => {
    it('ok', () => {
      const checkFilterData = spyOn(service, 'checkFilterData')

      service.process(qb, identifierMap, [['country', Operators['='], 'us']])

      expect(checkFilterData).toHaveBeenCalledTimes(1)
      expect(where).toHaveBeenCalledTimes(1)
    })

    it('disableFilter', () => {
      const fn = () =>
        service.process(qb, identifierMap, [['source', Operators['='], 'us']])

      expect(fn).toThrow(`Filter disable for field 'source'`)
    })
  })

  describe('checkOperator', () => {
    it('Unsupported operator', () => {
      const fn = () =>
        service.process(qb, identifierMap, [['year', 'hz' as any, 2010]])

      expect(fn).toThrow("Unsupported operator 'hz'")
    })

    it('Operator not support for type', () => {
      const fn = () =>
        service.process(qb, identifierMap, [['year', Operators.contains, 2010]])

      expect(fn).toThrow("Operator not support for type 'number'")
    })
  })
})
