import { IpFilter } from '@/stream-filter/filters/ip-filter'

describe('IpFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handle', () => {
    it('Should return true, if restrictions not set', async () => {
      const filter = new IpFilter(
        {
          type: 'ip',
          values: ['22.33.1-44.*'],
        },
        '22.33.1-44.*',
      )

      const result = filter.handle()

      expect(result).toBe(true)
    })
  })
})
