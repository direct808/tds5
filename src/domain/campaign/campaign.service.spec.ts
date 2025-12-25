import { Test, TestingModule } from '@nestjs/testing'
import { CampaignService } from './campaign.service'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'
import { DomainRepository } from '@/infra/repositories/domain.repository'

jest.mock('@/infra/repositories/utils/repository-utils')

describe('CampaignService', () => {
  let service: CampaignService
  let sourceRepository: SourceRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: SourceRepository,
          useValue: {},
        },
        {
          provide: DomainRepository,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<CampaignService>(CampaignService)
    sourceRepository = module.get<SourceRepository>(SourceRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return early if sourceId is not provided', async () => {
    const result = await service.ensureSourceExists({
      userId: 'user-1',
      sourceId: undefined,
    })
    expect(result).toBeUndefined()
    expect(ensureEntityExists).not.toHaveBeenCalled()
  })

  it('should call ensureEntityExists with correct params', async () => {
    await service.ensureSourceExists({
      userId: 'user-1',
      sourceId: 'source-123',
    })

    expect(ensureEntityExists).toHaveBeenCalledWith(
      sourceRepository,
      { userId: 'user-1', id: 'source-123' },
      'Source not found',
    )
  })
})
