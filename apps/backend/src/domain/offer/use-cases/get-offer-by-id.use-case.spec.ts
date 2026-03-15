import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { GetOfferByIdUseCase } from './get-offer-by-id.use-case'
import { OfferRepository } from '@/infra/repositories/offer.repository'
import { GetOfferByIdResponseDto } from '@/domain/offer/dto/get-offer-by-id-response.dto'

const mockEntity = {
  id: 'offer-1',
  name: 'Test Offer',
  url: 'https://example.com',
}

describe('GetOfferByIdUseCase', () => {
  let useCase: GetOfferByIdUseCase
  const repository = {
    getByIdAndUserId: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOfferByIdUseCase,
        {
          provide: OfferRepository,
          useValue: repository,
        },
      ],
    }).compile()

    useCase = module.get(GetOfferByIdUseCase)

    jest.clearAllMocks()
  })

  it('should return GetOfferByIdResponseDto when entity is found', async () => {
    repository.getByIdAndUserId.mockResolvedValue(mockEntity)

    const result = await useCase.execute('offer-1', 'user-1')

    expect(result).toBeInstanceOf(GetOfferByIdResponseDto)
    expect(result.id).toBe(mockEntity.id)
    expect(result.name).toBe(mockEntity.name)
    expect(result.url).toBe(mockEntity.url)
  })

  it('should call repository.getByIdAndUserId with correct args', async () => {
    repository.getByIdAndUserId.mockResolvedValue(mockEntity)

    await useCase.execute('offer-1', 'user-1')

    expect(repository.getByIdAndUserId).toHaveBeenCalledWith({
      id: 'offer-1',
      userId: 'user-1',
    })
  })

  it('should throw NotFoundException when entity is not found', async () => {
    repository.getByIdAndUserId.mockResolvedValue(null)

    await expect(useCase.execute('offer-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('should include id in NotFoundException message when entity is not found', async () => {
    repository.getByIdAndUserId.mockResolvedValue(null)

    await expect(useCase.execute('offer-1', 'user-1')).rejects.toThrow(
      'offer-1',
    )
  })
})
