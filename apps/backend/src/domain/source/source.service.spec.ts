import { Test, TestingModule } from '@nestjs/testing'
import { SourceService } from './source.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SourceRepository } from '../../infra/repositories/source.repository'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
} from '../../infra/repositories/utils/repository-utils'
import { SourceModel } from '@generated/prisma/models/Source'

jest.mock('../../infra/repositories/utils/repository-utils')

describe('SourceService', () => {
  let service: SourceService
  let repository: jest.Mocked<SourceRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SourceService,
        EventEmitter2,
        {
          provide: SourceRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            softDeleteMany: jest.fn(),
            getListByUserId: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<SourceService>(SourceService)
    repository = module.get(SourceRepository)

    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should check unique name and call create', async () => {
      const args = { name: 'Test', userId: '1' }

      await service.create(args)

      expect(checkUniqueNameForCreate).toHaveBeenCalledWith(repository, args)
      expect(repository.create).toHaveBeenCalledWith(args)
    })
  })

  describe('update', () => {
    it('should ensure entity exists and update name if provided', async () => {
      const args = { id: '123', name: 'New Name', userId: 'Userid' }

      await service.update(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, {
        ids: ['123'],
        userId: 'Userid',
      })
      expect(checkUniqueNameForUpdate).toHaveBeenCalledWith(repository, args)
      expect(repository.update).toHaveBeenCalledWith('123', args)
    })

    it('should update without name check if name is not provided', async () => {
      const args = { id: '123', userId: 'Userid' }

      await service.update(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, {
        ids: ['123'],
        userId: 'Userid',
      })
      expect(checkUniqueNameForUpdate).not.toHaveBeenCalled()
      expect(repository.update).toHaveBeenCalledWith('123', args)
    })
  })

  describe('getList', () => {
    it('should return list from repository', async () => {
      const userId = 'user123'
      const list = [{ id: '1', name: 'Test' }] as unknown as SourceModel[]
      repository.getListByUserId.mockResolvedValue(list)

      const result = await service.getList(userId)

      expect(repository.getListByUserId).toHaveBeenCalledWith(userId)
      expect(result).toBe(list)
    })
  })

  describe('delete', () => {
    it('should ensure entity exists and call delete', async () => {
      const args = { ids: ['del123'], userId: 'Userid' }

      await service.deleteMany(args)

      expect(ensureEntityExists).toHaveBeenCalledWith(repository, args)
      expect(repository.softDeleteMany).toHaveBeenCalledWith(args.ids)
    })
  })
})
