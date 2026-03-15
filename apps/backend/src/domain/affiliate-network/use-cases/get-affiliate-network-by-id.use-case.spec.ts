import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { GetAffiliateNetworkByIdUseCase } from './get-affiliate-network-by-id.use-case'
import { AffiliateNetworkRepository } from '@/infra/repositories/affiliate-network.repository'
import { GetAffiliateNetworkByIdResponseDto } from '@/domain/affiliate-network/dto/get-affiliate-network-by-id-response.dto'

const mockEntity = {
  id: 'network-1',
  name: 'Test Network',
  offerParams: 'param1=value1',
}

describe('GetAffiliateNetworkByIdUseCase', () => {
  let useCase: GetAffiliateNetworkByIdUseCase
  const repository = {
    getByIdsAndUserId: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAffiliateNetworkByIdUseCase,
        {
          provide: AffiliateNetworkRepository,
          useValue: repository,
        },
      ],
    }).compile()

    useCase = module.get(GetAffiliateNetworkByIdUseCase)

    jest.clearAllMocks()
  })

  it('should return GetAffiliateNetworkByIdResponseDto when entity is found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([mockEntity])

    const result = await useCase.execute('network-1', 'user-1')

    expect(result).toBeInstanceOf(GetAffiliateNetworkByIdResponseDto)
    expect(result.id).toBe(mockEntity.id)
    expect(result.name).toBe(mockEntity.name)
    expect(result.offerParams).toBe(mockEntity.offerParams)
  })

  it('should call repository.getByIdsAndUserId with correct args', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([mockEntity])

    await useCase.execute('network-1', 'user-1')

    expect(repository.getByIdsAndUserId).toHaveBeenCalledWith({
      ids: ['network-1'],
      userId: 'user-1',
    })
  })

  it('should throw NotFoundException when entity is not found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([])

    await expect(useCase.execute('network-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('should include id in NotFoundException message when entity is not found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([])

    await expect(useCase.execute('network-1', 'user-1')).rejects.toThrow(
      'network-1',
    )
  })
})
