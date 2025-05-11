import { Test, TestingModule } from '@nestjs/testing'
import { AffiliateNetworkService } from './affiliate-network.service'
import { AffiliateNetworkRepository } from './affiliate-network.repository'
import { AffiliateNetwork } from './affiliate-network.entity'
import {
  ensureEntityExists,
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
} from '../utils/repository-utils'

jest.mock('../utils/repository-utils')

describe('AffiliateNetworkService', () => {
  let service: AffiliateNetworkService
  let repository: jest.Mocked<AffiliateNetworkRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AffiliateNetworkService,
        {
          provide: AffiliateNetworkRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getListByUserId: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AffiliateNetworkService>(AffiliateNetworkService)
    repository = module.get(AffiliateNetworkRepository)
  })

  afterEach(() => jest.clearAllMocks())

  describe('create', () => {
    it('should check uniqueness and create entity', async () => {
      const args = { name: 'Test Network', userId: 'user123' }

      await service.create(args)

      expect(checkUniqueNameForCreate).toHaveBeenCalledWith(repository, args)
      expect(repository.create).toHaveBeenCalledWith(args)
    })
  })

  describe('update', () => {
    it('should check existence, uniqueness and update entity', async () => {
      const args = { id: '1', name: 'New Name', userId: 'user123' }

      await service.update(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, args)
      expect(checkUniqueNameForUpdate).toHaveBeenCalledWith(repository, args)
      expect(repository.update).toHaveBeenCalledWith('1', args)
    })

    it('should update entity without checking name if not provided', async () => {
      const args = { id: '1', userId: 'user123' }

      await service.update(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, args)
      expect(checkUniqueNameForUpdate).not.toHaveBeenCalled()
      expect(repository.update).toHaveBeenCalledWith('1', args)
    })
  })

  describe('getList', () => {
    it('should return list of networks by userId', async () => {
      const userId = 'user123'
      const list = [
        { id: '1', name: 'Net A', userId },
        { id: '2', name: 'Net B', userId },
      ] as unknown as AffiliateNetwork[]

      repository.getListByUserId.mockResolvedValue(list)

      const result = await service.getList(userId)

      expect(result).toEqual(list)
      expect(repository.getListByUserId).toHaveBeenCalledWith(userId)
    })
  })

  describe('delete', () => {
    it('should check existence and delete entity', async () => {
      const args = { id: '1', userId: 'user123' }

      await service.delete(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, args)
      expect(repository.delete).toHaveBeenCalledWith(args.id)
    })
  })
})
