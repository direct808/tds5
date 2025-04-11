import { SourceService } from './source.service'
import { SourceRepository } from './source.repository'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { Source } from './source.entity'

describe('SourceService', () => {
  const repository = {
    getByName: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    getListByUserId: jest.fn(),
    delete: jest.fn(),
    getByNameAndUserId: jest.fn(),
  } as unknown as jest.Mocked<SourceRepository>

  const service = new SourceService(repository as unknown as SourceRepository)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('создаёт новый источник, если такого нет', async () => {
      repository.getByName.mockResolvedValue(null)

      await service.create({ name: 'Test', userId: '1' })

      expect(repository.getByName).toHaveBeenCalledWith('Test', '1')
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Test',
        userId: '1',
      })
    })

    it('выбрасывает ConflictException, если уже существует', async () => {
      repository.getByName.mockResolvedValue({ id: 'existing' } as Source)

      await expect(
        service.create({ name: 'Test', userId: '1' }),
      ).rejects.toThrow(ConflictException)
      expect(repository.create).not.toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('обновляет источник, если найден', async () => {
      repository.getById.mockResolvedValue({
        id: '1',
        name: 'Old',
        userId: '1',
      } as Source)

      await service.update('1', '1', { name: 'Updated' })

      expect(repository.getById).toHaveBeenCalledWith('1', '1')
      expect(repository.update).toHaveBeenCalledWith('1', { name: 'Updated' })
    })

    it('выбрасывает NotFoundException, если не найден', async () => {
      repository.getById.mockResolvedValue(null)

      await expect(
        service.update('1', '1', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException)
      expect(repository.update).not.toHaveBeenCalled()
    })

    it('Должен выбросить ConflictException если имя не уникальное', async () => {
      repository.getById.mockResolvedValue({ id: 'id123' } as Source)
      repository.getByNameAndUserId.mockResolvedValue({
        id: 'another-id',
      } as Source)

      await expect(
        service.update('id123', 'user123', { name: 'Test Name' }),
      ).rejects.toThrow(ConflictException)
      expect(repository.getByNameAndUserId).toHaveBeenCalledWith(
        'Test Name',
        'user123',
      )
    })

    it('Не должен выбросить ConflictException, если есть такое же имя с таким же id', async () => {
      repository.getById.mockResolvedValue({ id: 'id123' } as Source)
      repository.getByNameAndUserId.mockResolvedValue({ id: 'id123' } as Source)

      await service.update('id123', 'user123', { name: 'Test Name' })
      await expect(
        service.update('id123', 'user123', { name: 'Test Name' }),
      ).resolves.not.toThrow(ConflictException)
      expect(repository.getByNameAndUserId).toHaveBeenCalledWith(
        'Test Name',
        'user123',
      )
    })
  })

  describe('getList', () => {
    it('возвращает список', async () => {
      repository.getListByUserId.mockResolvedValue([
        { id: '1', name: 'Test' } as Source,
      ])

      const result = await service.getList('1')

      expect(repository.getListByUserId).toHaveBeenCalledWith('1')
      expect(result).toEqual([{ id: '1', name: 'Test' }])
    })
  })

  describe('delete', () => {
    it('удаляет, если найден', async () => {
      repository.getById.mockResolvedValue({
        id: '1',
        name: 'Test',
        userId: '1',
      } as Source)

      await service.delete('1', '1')

      expect(repository.delete).toHaveBeenCalledWith('1')
    })

    it('выбрасывает NotFoundException, если не найден', async () => {
      repository.getById.mockResolvedValue(null)

      await expect(service.delete('1', '1')).rejects.toThrow(NotFoundException)
      expect(repository.delete).not.toHaveBeenCalled()
    })
  })
})
