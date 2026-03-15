import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { GetCampaignByIdUseCase } from './get-campaign-by-id.use-case'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { GetCampaignByIdResponseDto } from '@/domain/campaign/dto/get-campaign-by-id-response.dto'

const mockEntity = {
  id: 'campaign-1',
  name: 'Test Campaign',
  code: 'abc123',
  domainId: null,
  sourceId: 'source-1',
  active: true,
}

describe('GetCampaignByIdUseCase', () => {
  let useCase: GetCampaignByIdUseCase
  const repository = {
    getByIdsAndUserId: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCampaignByIdUseCase,
        {
          provide: CampaignRepository,
          useValue: repository,
        },
      ],
    }).compile()

    useCase = module.get(GetCampaignByIdUseCase)

    jest.clearAllMocks()
  })

  it('should return GetCampaignByIdResponseDto when entity is found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([mockEntity])

    const result = await useCase.execute('campaign-1', 'user-1')

    expect(result).toBeInstanceOf(GetCampaignByIdResponseDto)
    expect(result.id).toBe(mockEntity.id)
    expect(result.name).toBe(mockEntity.name)
    expect(result.code).toBe(mockEntity.code)
    expect(result.domainId).toBe(mockEntity.domainId)
    expect(result.sourceId).toBe(mockEntity.sourceId)
    expect(result.active).toBe(mockEntity.active)
  })

  it('should call repository.getByIdsAndUserId with correct args', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([mockEntity])

    await useCase.execute('campaign-1', 'user-1')

    expect(repository.getByIdsAndUserId).toHaveBeenCalledWith({
      ids: ['campaign-1'],
      userId: 'user-1',
    })
  })

  it('should throw NotFoundException when entity is not found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([])

    await expect(useCase.execute('campaign-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('should include id in NotFoundException message when entity is not found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([])

    await expect(useCase.execute('campaign-1', 'user-1')).rejects.toThrow(
      'campaign-1',
    )
  })
})
