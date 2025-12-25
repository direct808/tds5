import { Test, TestingModule } from '@nestjs/testing'
import { CheckArgsService } from './check-args.service'
import { BadRequestException } from '@nestjs/common'
import { ReportService } from '@/domain/report/report.service'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'

describe('CheckArgsService', () => {
  let service: CheckArgsService

  const mockReportService = {
    getAllGroupFieldNames: jest.fn(),
    getAllMetricsFieldNames: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckArgsService,
        { provide: ReportService, useValue: mockReportService },
      ],
    }).compile()

    service = module.get<CheckArgsService>(CheckArgsService)

    jest.clearAllMocks()
  })

  it('does nothing if sortField is empty', () => {
    const args = {
      limit: 25,
      offset: 0,
      sortField: undefined,
      groups: [],
      metrics: [],
      filter: [],
    }
    expect(() => service.checkArgs(args)).not.toThrow()
  })

  it('passes if sortField exists in group fields', () => {
    mockReportService.getAllGroupFieldNames.mockReturnValue(['group1'])
    mockReportService.getAllMetricsFieldNames.mockReturnValue(['metric1'])

    const args: GetReportDto = {
      limit: 25,
      offset: 0,
      sortField: 'group1',
      groups: ['group1'],
      metrics: [],
      filter: [],
    }
    expect(() => service.checkArgs(args)).not.toThrow()
  })

  it('passes if sortField exists in metric fields', () => {
    mockReportService.getAllGroupFieldNames.mockReturnValue(['group1'])
    mockReportService.getAllMetricsFieldNames.mockReturnValue(['metric1'])

    const args: GetReportDto = {
      limit: 25,
      offset: 0,
      sortField: 'metric1',
      groups: [],
      metrics: ['metric1'],
      filter: [],
    }
    expect(() => service.checkArgs(args)).not.toThrow()
  })

  it('throws if sortField unknown', () => {
    mockReportService.getAllGroupFieldNames.mockReturnValue(['group1'])
    mockReportService.getAllMetricsFieldNames.mockReturnValue(['metric1'])

    const args: GetReportDto = {
      limit: 25,
      offset: 0,
      sortField: 'unknown',
      groups: [],
      metrics: [],
      filter: [],
    }

    expect(() => service.checkArgs(args)).toThrow(BadRequestException)
  })

  it('throws if sortField not in metrics or groups', () => {
    mockReportService.getAllGroupFieldNames.mockReturnValue(['group1'])
    mockReportService.getAllMetricsFieldNames.mockReturnValue(['metric1'])

    const args: GetReportDto = {
      limit: 25,
      offset: 0,
      sortField: 'metric1',
      groups: ['group2'],
      metrics: ['metric2'],
      filter: [],
    }

    expect(() => service.checkArgs(args)).toThrow(
      new BadRequestException(
        'Order field metric1 must contain in metrics or group',
      ),
    )
  })
})
