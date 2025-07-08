import { StreamFilterService } from '@/stream-filter/stream-filter.service'
import { FilterLogic, FilterObject } from '@/stream-filter/types'
import { MockRequestAdapter } from '@/utils/request-adapter'
import { ClickData } from '@/click/click-data'
import { spyOn } from '../../test/utils/helpers'

describe('StreamFilterService', () => {
  let service: StreamFilterService
  const mockStreamFilterFactory = {
    create: jest.fn(),
  }
  const mockClickData = {} as ClickData
  const mockRequest = new MockRequestAdapter()

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
    let handle: jest.SpyInstance
    let processExclude: jest.SpyInstance

    const clickData = {} as ClickData
    const request = new MockRequestAdapter()

    beforeEach(() => {
      handle = spyOn(service, 'handle')
      processExclude = spyOn(service, 'processExclude')
    })

    it('should call handle and processExclude with correct arguments', () => {
      const filter = { exclude: true } as FilterObject

      const handleResult = false
      const expectedResult = true

      handle.mockReturnValue(handleResult)
      processExclude.mockReturnValue(expectedResult)

      const result = service['filter'](filter, clickData, request)

      expect(service['handle']).toHaveBeenCalledWith(filter, clickData, request)
      expect(service['processExclude']).toHaveBeenCalledWith(
        handleResult,
        filter.exclude,
      )
      expect(result).toBe(expectedResult)
    })
  })

  describe('checkFilter', () => {
    let filter: jest.SpyInstance
    const request = new MockRequestAdapter()

    beforeEach(() => {
      filter = spyOn(service, 'filter')
    })

    it('should return { value: true, break: true } if result is true and logic is OR', () => {
      const filterObj = {} as FilterObject
      const clickData = {} as ClickData

      filter.mockReturnValue(true)

      const result = service['checkFilter'](
        filterObj,
        clickData,
        FilterLogic.Or,
        request,
      )

      expect(service['filter']).toHaveBeenCalledWith(filter, clickData, request)
      expect(result).toEqual({ value: true, break: true })
    })

    it('should return { value: false, break: true } if result is false and logic is AND', () => {
      const filterObj = {} as FilterObject
      const clickData = {} as ClickData

      filter.mockReturnValue(false)

      const result = service['checkFilter'](
        filterObj,
        clickData,
        FilterLogic.And,
        request,
      )

      expect(service['filter']).toHaveBeenCalledWith(filter, clickData, request)
      expect(result).toEqual({ value: false, break: true })
    })

    it('should return { value: true } if result is true and logic is AND', () => {
      const filterObj = {} as FilterObject
      const clickData = {} as ClickData

      filter.mockReturnValue(true)

      const result = service['checkFilter'](
        filterObj,
        clickData,
        FilterLogic.And,
        request,
      )

      expect(result).toEqual({ value: true })
    })

    it('should return { value: false } if result is false and logic is OR', () => {
      const filterObj = {} as FilterObject
      const clickData = {} as ClickData

      filter.mockReturnValue(false)

      const result = service['checkFilter'](
        filterObj,
        clickData,
        FilterLogic.Or,
        request,
      )

      expect(result).toEqual({ value: false })
    })
  })
})
