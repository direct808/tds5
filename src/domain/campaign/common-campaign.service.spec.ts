import { Test, TestingModule } from '@nestjs/testing'
import { CommonCampaignService } from './common-campaign.service'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { ensureEntityExists } from '@/infra/repositories/utils/repository-utils'
import { DomainRepository } from '@/infra/repositories/domain.repository'

jest.mock('@/infra/repositories/utils/repository-utils')

describe('CommonCampaignService', () => {
  let service: CommonCampaignService
  let sourceRepository: SourceRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonCampaignService,
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

    service = module.get<CommonCampaignService>(CommonCampaignService)
    sourceRepository = module.get<SourceRepository>(SourceRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return early if sourceId is not provided', async () => {
    const result = await service.ensureSourceExists('user-1', undefined)
    expect(result).toBeUndefined()
    expect(ensureEntityExists).not.toHaveBeenCalled()
  })

  it('should call ensureEntityExists with correct params', async () => {
    await service.ensureSourceExists('user-1', 'source-123')

    expect(ensureEntityExists).toHaveBeenCalledWith(
      sourceRepository,
      { userId: 'user-1', id: 'source-123' },
      'Source not found',
    )
  })
})
