import { Test, TestingModule } from '@nestjs/testing'
import { CommonCampaignService } from './common-campaign.service.js'
import { SourceRepository } from '@/source/source.repository.js'
import { ensureEntityExists } from '@/utils/repository-utils.js'

jest.mock('../utils/repository-utils.js')

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
