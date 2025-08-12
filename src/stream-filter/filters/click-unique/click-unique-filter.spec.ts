import {
  ClickUniqueFilter,
  ClickUniqueFor,
  ClickUniqueProvider,
} from '@/stream-filter/filters/click-unique/click-unique-filter'

describe('click-unique-filter.ts', () => {
  const getCountByVisitorId = jest.fn()
  const getCountByVisitorIdCampaignId = jest.fn()
  const getCountByVisitorIdStreamId = jest.fn()

  const provider: ClickUniqueProvider = {
    getCountByVisitorId,
    getCountByVisitorIdCampaignId,
    getCountByVisitorIdStreamId,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should throw error if no visitorId', () => {
    // 1. Arrange
    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.allCampaigns,
        streamId: 'stream-id',
      },
      provider,
      {},
    )

    // 2, 3. Act, Assert
    expect(() => filter.handle()).rejects.toThrow('No visitorId')
  })

  it('Should throw error if no campaignId', () => {
    // 1. Arrange
    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.allCampaigns,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id' },
    )

    // 2, 3. Act, Assert
    expect(() => filter.handle()).rejects.toThrow('No campaignId')
  })

  it('Should return false if getCountByVisitorId not zero', async () => {
    // 1. Arrange
    getCountByVisitorId.mockReturnValue(10)

    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.allCampaigns,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id', campaignId: 'campaign-id' },
    )

    // 2. Act
    const result = await filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })

  it('Should return true if getCountByVisitorId is zero', async () => {
    // 1. Arrange
    getCountByVisitorId.mockReturnValue(0)

    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.allCampaigns,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id', campaignId: 'campaign-id' },
    )

    // 2. Act
    const result = await filter.handle()

    // 3. Assert
    expect(result).toEqual(true)
  })

  it('Should return false if getCountByVisitorIdCampaignId not zero', async () => {
    // 1. Arrange
    getCountByVisitorIdCampaignId.mockReturnValue(10)

    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.campaign,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id', campaignId: 'campaign-id' },
    )

    // 2. Act
    const result = await filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })

  it('Should return true if getCountByVisitorIdCampaignId is zero', async () => {
    // 1. Arrange
    getCountByVisitorIdCampaignId.mockReturnValue(0)

    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.campaign,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id', campaignId: 'campaign-id' },
    )

    // 2. Act
    const result = await filter.handle()

    // 3. Assert
    expect(result).toEqual(true)
  })

  it('Should return false if getCountByVisitorIdStreamId not zero', async () => {
    // 1. Arrange
    getCountByVisitorIdStreamId.mockReturnValue(10)

    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.stream,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id', campaignId: 'campaign-id' },
    )

    // 2. Act
    const result = await filter.handle()

    // 3. Assert
    expect(result).toEqual(false)
  })

  it('Should return true if getCountByVisitorIdStreamId is zero', async () => {
    // 1. Arrange
    getCountByVisitorIdStreamId.mockReturnValue(0)

    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: ClickUniqueFor.stream,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id', campaignId: 'campaign-id' },
    )

    // 2. Act
    const result = await filter.handle()

    // 3. Assert
    expect(result).toEqual(true)
  })

  it('Should expect reject is bad for value', async () => {
    // 1. Arrange
    getCountByVisitorIdStreamId.mockReturnValue(0)

    const filter = new ClickUniqueFilter(
      {
        type: 'click-unique',
        for: 'bad value' as any,
        streamId: 'stream-id',
      },
      provider,
      { visitorId: 'visitor-id', campaignId: 'campaign-id' },
    )

    // Act, Assert
    expect(() => filter.handle()).rejects.toThrow('Unknown filterObj.for')
  })
})
