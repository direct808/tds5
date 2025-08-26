import { ConflictException, NotFoundException } from '@nestjs/common'
import {
  checkUniqueNameForCreate,
  checkUniqueNameForUpdate,
  ensureEntityExists,
  getIdsForDelete,
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
} from './repository-utils'

describe('repository-utils', () => {
  describe('checkUniqueNameForCreate', () => {
    it('should not throw when name is unique', async () => {
      const mockRepository: IGetEntityByNameAndUserId = {
        getByNameAndUserId: jest.fn().mockResolvedValue(null),
      }

      const args = { name: 'unique', userId: 'user1' }

      await expect(
        checkUniqueNameForCreate(mockRepository, args),
      ).resolves.not.toThrow()

      expect(mockRepository.getByNameAndUserId).toHaveBeenCalledWith(args)
    })

    it('should throw ConflictException when name exists', async () => {
      const mockRepository: IGetEntityByNameAndUserId = {
        getByNameAndUserId: jest
          .fn()
          .mockResolvedValue({ id: '1', name: 'exists', userId: 'user1' }),
      }

      const args = { name: 'exists', userId: 'user1' }

      await expect(
        checkUniqueNameForCreate(mockRepository, args),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('checkUniqueNameForUpdate', () => {
    it('should not throw when name is unique', async () => {
      const mockRepository: IGetEntityByNameAndUserId = {
        getByNameAndUserId: jest.fn().mockResolvedValue(null),
      }

      const args = { id: '1', name: 'unique', userId: 'user1' }

      await expect(
        checkUniqueNameForUpdate(mockRepository, args),
      ).resolves.not.toThrow()
    })

    it('should not throw when name exists but is the same entity', async () => {
      const mockRepository: IGetEntityByNameAndUserId = {
        getByNameAndUserId: jest
          .fn()
          .mockResolvedValue({ id: '1', name: 'exists', userId: 'user1' }),
      }

      const args = { id: '1', name: 'exists', userId: 'user1' }

      await expect(
        checkUniqueNameForUpdate(mockRepository, args),
      ).resolves.not.toThrow()
    })

    it('should throw ConflictException when name exists for different entity', async () => {
      const mockRepository: IGetEntityByNameAndUserId = {
        getByNameAndUserId: jest
          .fn()
          .mockResolvedValue({ id: '2', name: 'exists', userId: 'user1' }),
      }

      const args = { id: '1', name: 'exists', userId: 'user1' }

      await expect(
        checkUniqueNameForUpdate(mockRepository, args),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('checkEntityExists', () => {
    it('should throw NotFoundException when entity does not exist', async () => {
      const mockRepository: IGetEntityByIdAndUserId = {
        getByIdAndUserId: jest.fn().mockResolvedValue(null),
      }

      const args = { id: '1', userId: 'user1' }

      await expect(ensureEntityExists(mockRepository, args)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should not throw when entity exists', async () => {
      const mockRepository: IGetEntityByIdAndUserId = {
        getByIdAndUserId: jest
          .fn()
          .mockResolvedValue({ id: '1', userId: 'user1' }),
      }

      const args = { id: '1', userId: 'user1' }

      await expect(
        ensureEntityExists(mockRepository, args),
      ).resolves.not.toThrow()
    })

    it('should throw NotFoundException when entity does not exist with message', async () => {
      const mockRepository: IGetEntityByIdAndUserId = {
        getByIdAndUserId: jest.fn().mockResolvedValue(null),
      }

      const args = { id: '1', userId: 'user1' }

      await expect(
        ensureEntityExists(mockRepository, args, 'Error message'),
      ).rejects.toThrow(new NotFoundException('Error message'))
    })
  })

  describe('getIdsForDelete', () => {
    it('check getIdsForDelete', () => {
      const exists = [{ id: '1' }, { id: '2' }, { id: '3' }]
      const input = [{}, { id: '2' }, { id: '3' }, { id: '4' }]

      const result = getIdsForDelete(exists, input)

      expect(result).toEqual(['1'])
    })
  })
})
