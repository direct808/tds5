import { Test } from '@nestjs/testing'
import { MetricProcessService } from './metric-process.service'
import { ReportQueryBuilder } from '@/domain/report/use-cases/get-report/report-query-builder'

describe('MetricProcessService', () => {
  let service: MetricProcessService
  const qb = {
    selectRaw: jest.fn(),
  } as unknown as ReportQueryBuilder
  const identifierMap = {
    clicks: 't.clicks',
    conversions_deposit: 'conversions_deposit',
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MetricProcessService],
    }).compile()

    service = module.get(MetricProcessService)

    jest.clearAllMocks()
  })

  it('processItemFormula', () => {
    service.process(qb, identifierMap, ['cr_deposit'])

    expect(qb.selectRaw).toHaveBeenCalledTimes(1)
    expect(qb.selectRaw).toHaveBeenCalledWith(
      'CAST(((conversions_deposit / nullif(t.clicks, 0)) * 100) AS DECIMAL(12,2))',
      'cr_deposit',
    )
  })

  it('processItemIdentifier', () => {
    service.process(qb, identifierMap, ['clicks'])

    expect(qb.selectRaw).toHaveBeenCalledTimes(1)
    expect(qb.selectRaw).toHaveBeenCalledWith('t.clicks', 'clicks')
  })

  it('Unknown metric if group', () => {
    const fn = () => service.process(qb, identifierMap, ['year'])

    expect(fn).toThrow(`Unknown metric: 'year'`)
  })
})
