import { CampaignCacheService } from '@/domain/campaign-cache/campaign-cache.service'
import { RedisProvider } from '@/infra/redis/redis.provider'
import { fullCampaignCodeCacheKey } from '@/domain/campaign-cache/helpers/campaign-cache-keys'
import { FullCampaign } from '@/domain/campaign/types'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'

describe('campaign-cache.service.ts', () => {
  const code = 'code'
  const cacheSet = jest.fn()
  const cacheGet = jest.fn()
  const cacheSAdd = jest.fn()
  const getFullBy = jest.fn()
  const redis: RedisProvider = {
    get: cacheGet,
    set: cacheSet,
    sAdd: cacheSAdd,
  } as unknown as RedisProvider
  const campaignRepository = {
    getFullBy,
  } as unknown as CampaignRepository
  let service: CampaignCacheService

  const campaign: FullCampaign = {
    sourceId: 'source-id',
    streams: [
      {
        streamOffers: [
          { offer: { id: 'offer-id', affiliateNetworkId: 'af-id' } },
        ],
      },
    ],
  } as FullCampaign

  beforeEach(() => {
    jest.resetAllMocks()
    service = new CampaignCacheService(
      redis,
      campaignRepository as CampaignRepository,
    )
  })

  it('Should throw error if campaign not found and no cache', async () => {
    // Act
    const res = service.getFull({ code })

    // Assert
    await expect(res).rejects.toThrowError('No campaign')
    expect(cacheSet).toBeCalledWith(fullCampaignCodeCacheKey(code), 'N')
    expect(cacheSet).toBeCalledTimes(1)
    expect(cacheGet).toBeCalledTimes(1)
    expect(getFullBy).toBeCalledTimes(1)
  })

  it('Should throw error if campaign not found and set cache', async () => {
    // Arrange
    cacheGet.mockReturnValue('N')

    // Act
    const res = service.getFull({ code })

    // Assert
    await expect(res).rejects.toThrowError('No campaign')
    expect(cacheSet).toBeCalledTimes(0)
    expect(cacheGet).toBeCalledTimes(1)
    expect(getFullBy).toBeCalledTimes(0)
  })

  it('Should return campaign if no cache', async () => {
    // Arrange

    getFullBy.mockReturnValue(campaign)

    // Act
    const res = await service.getFull({ code })

    // Assert
    expect(res).toStrictEqual(campaign)

    expect(cacheSet).toBeCalledWith(
      fullCampaignCodeCacheKey(code),
      JSON.stringify(campaign),
    )
    expect(cacheSet).toBeCalledTimes(1)
    expect(cacheGet).toBeCalledTimes(1)
    expect(getFullBy).toBeCalledTimes(1)
  })

  it('Should return campaign if cache exists', async () => {
    // Arrange
    cacheGet.mockReturnValue(JSON.stringify(campaign))

    // Act
    const res = await service.getFull({ code })

    // Assert
    expect(res).toStrictEqual(campaign)

    expect(cacheSet).toBeCalledTimes(0)
    expect(cacheGet).toBeCalledTimes(1)
    expect(getFullBy).toBeCalledTimes(0)
  })
})
