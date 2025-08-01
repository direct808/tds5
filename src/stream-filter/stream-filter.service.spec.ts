import { StreamFilterService } from '@/stream-filter/stream-filter.service'
import { FilterLogic, FilterObjectExtended } from '@/stream-filter/types'
import { spyOn } from '../../test/utils/helpers'

describe('StreamFilterService', () => {
  let service: StreamFilterService
  const mockStreamFilterFactory = {
    create: jest.fn(),
  }

  beforeEach(async () => {
    service = new StreamFilterService(mockStreamFilterFactory)
    jest.clearAllMocks()
  })

  describe('processExclude', () => {
    it('should return result if exclude is false', () => {
      expect(service['processExclude'](true, false)).toBe(true)
      expect(service['processExclude'](false, false)).toBe(false)
    })

    it('should return !result if exclude is true', () => {
      expect(service['processExclude'](true, true)).toBe(false)
      expect(service['processExclude'](false, true)).toBe(true)
    })

    it('should return result if exclude is undefined', () => {
      expect(service['processExclude'](true)).toBe(true)
      expect(service['processExclude'](false)).toBe(false)
    })
  })

  describe('filter', () => {
    it('should call handle and processExclude with correct arguments', async () => {
      // Arrange
      const filter = {
        exclude: true,
      } as FilterObjectExtended

      const handleResult = false
      const expectedResult = true

      const handle = spyOn(service, 'handle')
      const processExclude = spyOn(service, 'processExclude')

      handle.mockReturnValue(handleResult)
      processExclude.mockReturnValue(expectedResult)

      // Act
      const result = await service['filter'](filter)

      // Assertion
      expect(handle).toHaveBeenCalledWith(filter)
      expect(processExclude).toHaveBeenCalledWith(handleResult, filter.exclude)
      expect(result).toBe(expectedResult)
    })
  })

  describe('checkFilter', () => {
    let filter: jest.SpyInstance

    beforeEach(() => {
      filter = spyOn(service, 'filter')
    })

    it('should return { value: true, break: true } if result is true and logic is OR', async () => {
      const filterObj = {} as FilterObjectExtended

      filter.mockReturnValue(true)

      // Act
      const result = await service['checkFilter'](filterObj, FilterLogic.Or)

      // Assert
      expect(service['filter']).toHaveBeenCalledWith(filterObj)
      expect(result).toEqual({ value: true, break: true })
    })

    it('should return { value: false, break: true } if result is false and logic is AND', async () => {
      const filterObj = {} as FilterObjectExtended

      filter.mockReturnValue(false)

      const result = await service['checkFilter'](filterObj, FilterLogic.And)

      expect(service['filter']).toHaveBeenCalledWith(filterObj)
      expect(result).toEqual({ value: false, break: true })
    })

    it('should return { value: true } if result is true and logic is AND', async () => {
      const filterObj = {} as FilterObjectExtended

      filter.mockReturnValue(true)

      const result = await service['checkFilter'](filterObj, FilterLogic.And)

      expect(result).toEqual({ value: true })
    })

    it('should return { value: false } if result is false and logic is OR', async () => {
      const filterObj = {} as FilterObjectExtended

      filter.mockReturnValue(false)

      const result = await service['checkFilter'](filterObj, FilterLogic.Or)

      expect(result).toEqual({ value: false })
    })
  })
})
