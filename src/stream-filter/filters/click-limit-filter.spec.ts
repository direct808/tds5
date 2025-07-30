import { ClickLimitFilter } from '@/stream-filter/filters/click-limit-filter'
import { spyOn } from '../../../test/utils/helpers'

describe('ClickLimitFilter', () => {
  const provider = {
    getClickPerHour: jest.fn(),
    getClickPerDay: jest.fn(),
    getClickTotal: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handle', () => {
    it('Should return true, if restrictions not set', async () => {
      const filter = new ClickLimitFilter(
        {
          type: 'click-limit',
        },
        provider,
        '4',
      )

      const result = await filter.handle()

      expect(result).toBe(true)
    })

    it('Should called check 3 times', async () => {
      const filter = new ClickLimitFilter({} as any, provider, '4')

      const check = spyOn(filter, 'check').mockReturnValue(true)

      const result = await filter.handle()

      expect(result).toBe(true)
      expect(check).toHaveBeenCalledWith('getClickPerHour', 'perHour')
      expect(check).toHaveBeenCalledWith('getClickPerDay', 'perDay')
      expect(check).toHaveBeenCalledWith('getClickTotal', 'total')
      expect(check).toHaveBeenCalledTimes(3)
    })
  })

  describe('check', () => {
    it('should return true if value is not set', async () => {
      const filter = new ClickLimitFilter({} as any, provider, '4')

      const result = await filter['check']('getClickPerHour', 'perHour')
      expect(result).toBe(true)
      expect(provider.getClickPerHour).not.toHaveBeenCalled()
    })

    it('should return true if count is less than to value', async () => {
      const filter = new ClickLimitFilter(
        {
          perHour: 100,
        } as any,
        provider,
        '123',
      )

      provider.getClickPerHour.mockResolvedValue(80)

      const result = await filter['check']('getClickPerHour', 'perHour')
      expect(result).toBe(true)
      expect(provider.getClickPerHour).toHaveBeenCalledWith('123')
    })

    it('should return false if count is equal to value', async () => {
      const filter = new ClickLimitFilter(
        {
          perHour: 100,
        } as any,
        provider,
        '123',
      )

      provider.getClickPerHour.mockResolvedValue(100)

      const result = await filter['check']('getClickPerHour', 'perHour')
      expect(result).toBe(false)
      expect(provider.getClickPerHour).toHaveBeenCalledWith('123')
    })

    it('should return false if count is more than value', async () => {
      const filter = new ClickLimitFilter(
        {
          perHour: 100,
        } as any,
        provider,
        '123',
      )

      provider.getClickPerHour.mockResolvedValue(120)

      const result = await filter['check']('getClickPerHour', 'perHour')
      expect(result).toBe(false)
      expect(provider.getClickPerHour).toHaveBeenCalledWith('123')
    })
  })
})
