import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { GetSourceByIdUseCase } from './get-source-by-id.use-case'
import { SourceRepository } from '@/infra/repositories/source.repository'
import { GetSourceByIdResponseDto } from '@/domain/source/dto/get-source-by-id-response.dto'

const mockEntity = {
  id: 'source-1',
  name: 'Test Source',
}

describe('GetSourceByIdUseCase', () => {
  let useCase: GetSourceByIdUseCase
  const repository = {
    getByIdsAndUserId: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSourceByIdUseCase,
        {
          provide: SourceRepository,
          useValue: repository,
        },
      ],
    }).compile()

    useCase = module.get(GetSourceByIdUseCase)

    jest.clearAllMocks()
  })

  it('should return GetSourceByIdResponseDto when entity is found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([mockEntity])

    const result = await useCase.execute('source-1', 'user-1')

    expect(result).toBeInstanceOf(GetSourceByIdResponseDto)
    expect(result.id).toBe(mockEntity.id)
    expect(result.name).toBe(mockEntity.name)
  })

  it('should call repository.getByIdsAndUserId with correct args', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([mockEntity])

    await useCase.execute('source-1', 'user-1')

    expect(repository.getByIdsAndUserId).toHaveBeenCalledWith({
      ids: ['source-1'],
      userId: 'user-1',
    })
  })

  it('should throw NotFoundException when entity is not found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([])

    await expect(useCase.execute('source-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('should include id in NotFoundException message when entity is not found', async () => {
    repository.getByIdsAndUserId.mockResolvedValue([])

    await expect(useCase.execute('source-1', 'user-1')).rejects.toThrow(
      'source-1',
    )
  })
})
