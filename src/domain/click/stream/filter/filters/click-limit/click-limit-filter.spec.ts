import { ClickLimitFilter } from './click-limit-filter'
import { spyOn } from '../../../../../../../test/utils/helpers'

describe('ClickLimitFilter', () => {
  const provider = {
    getCountPerHour: jest.fn(),
    getCountPerDay: jest.fn(),
    getCountTotal: jest.fn(),
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
      const filter = new ClickLimitFilter(
        { type: 'click-limit' },
        provider,
        '4',
      )

      const check = spyOn(filter, 'check').mockReturnValue(true)

      const result = await filter.handle()

      expect(result).toBe(true)
      expect(check).toHaveBeenCalledWith('getCountPerHour', 'perHour')
      expect(check).toHaveBeenCalledWith('getCountPerDay', 'perDay')
      expect(check).toHaveBeenCalledWith('getCountTotal', 'total')
      expect(check).toHaveBeenCalledTimes(3)
    })
  })

  describe('check', () => {
    it('should return true if value is not set', async () => {
      const filter = new ClickLimitFilter(
        { type: 'click-limit' },
        provider,
        '4',
      )

      const result = await filter['check']('getCountPerHour', 'perHour')
      expect(result).toBe(true)
      expect(provider.getCountPerHour).not.toHaveBeenCalled()
    })

    it('should return true if count is less than to value', async () => {
      const filter = new ClickLimitFilter(
        {
          perHour: 100,
        } as any,
        provider,
        '123',
      )

      provider.getCountPerHour.mockResolvedValue(80)

      const result = await filter['check']('getCountPerHour', 'perHour')
      expect(result).toBe(true)
      expect(provider.getCountPerHour).toHaveBeenCalledWith('123')
    })

    it('should return false if count is equal to value', async () => {
      const filter = new ClickLimitFilter(
        {
          type: 'click-limit',
          perHour: 100,
        },
        provider,
        '123',
      )

      provider.getCountPerHour.mockResolvedValue(100)

      const result = await filter['check']('getCountPerHour', 'perHour')
      expect(result).toBe(false)
      expect(provider.getCountPerHour).toHaveBeenCalledWith('123')
    })

    it('should return false if count is more than value', async () => {
      const filter = new ClickLimitFilter(
        {
          type: 'click-limit',
          perHour: 100,
        },
        provider,
        '123',
      )

      provider.getCountPerHour.mockResolvedValue(120)

      const result = await filter['check']('getCountPerHour', 'perHour')
      expect(result).toBe(false)
      expect(provider.getCountPerHour).toHaveBeenCalledWith('123')
    })
  })
})
