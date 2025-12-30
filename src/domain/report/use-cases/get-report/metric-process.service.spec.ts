import { Test } from '@nestjs/testing'
import { MetricProcessService } from './metric-process.service'
import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'

describe('MetricProcessService', () => {
  let service: MetricProcessService
  const qb = {
    selectMetric: jest.fn(),
  } as unknown as PostgresRawReportQueryBuilder
  const clickMetricMap = {
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
    service.process(qb, clickMetricMap, ['cr_deposit'])

    expect(qb.selectMetric).toHaveBeenCalledTimes(1)
    expect(qb.selectMetric).toHaveBeenCalledWith(
      'CAST(coalesce(((conversions_deposit / nullif(t.clicks, 0)) * 100) , 0) AS DECIMAL(12,2))',
      'cr_deposit',
      'avg',
    )
  })

  it('processItemClickMetric', () => {
    service.process(qb, clickMetricMap, ['clicks'])

    expect(qb.selectMetric).toHaveBeenCalledTimes(1)
    expect(qb.selectMetric).toHaveBeenCalledWith('t.clicks', 'clicks', 'sum')
  })

  it('Unknown metric if group', () => {
    const fn = () => service.process(qb, clickMetricMap, ['year'])

    expect(fn).toThrow(`Unknown metric: 'year'`)
  })
})
