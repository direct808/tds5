import { CampaignCacheService } from '@/campaign-cache/campaign-cache.service'
import { RedisProvider } from '@/infra/redis/redis.provider'
import { CampaignRepository } from '@/campaign/campaign.repository'
import { fullCampaignCacheKey } from '@/campaign-cache/helpers/campaign-cache-keys'
import { FullCampaign } from '@/campaign/types'

describe('campaign-cache.service.ts', () => {
  const code = 'code'
  const cacheSet = jest.fn()
  const cacheGet = jest.fn()
  const cacheSAdd = jest.fn()
  const repoGetFullByCode = jest.fn()
  const redis: RedisProvider = {
    get: cacheGet,
    set: cacheSet,
    sAdd: cacheSAdd,
  } as unknown as RedisProvider
  const campaignRepository = {
    getFullByCode: repoGetFullByCode,
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
    const res = service.getFullByCode(code)

    // Assert
    await expect(res).rejects.toThrowError('No campaign')
    expect(cacheSet).toBeCalledWith(fullCampaignCacheKey(code), 'N')
    expect(cacheSet).toBeCalledTimes(1)
    expect(cacheGet).toBeCalledTimes(1)
    expect(repoGetFullByCode).toBeCalledTimes(1)
  })

  it('Should throw error if campaign not found and set cache', async () => {
    // Arrange
    cacheGet.mockReturnValue('N')

    // Act
    const res = service.getFullByCode(code)

    // Assert
    await expect(res).rejects.toThrowError('No campaign')
    expect(cacheSet).toBeCalledTimes(0)
    expect(cacheGet).toBeCalledTimes(1)
    expect(repoGetFullByCode).toBeCalledTimes(0)
  })

  it('Should return campaign if no cache', async () => {
    // Arrange

    repoGetFullByCode.mockReturnValue(campaign)

    // Act
    const res = await service.getFullByCode(code)

    // Assert
    expect(res).toStrictEqual(campaign)

    expect(cacheSet).toBeCalledWith(
      fullCampaignCacheKey(code),
      JSON.stringify(campaign),
    )
    expect(cacheSet).toBeCalledTimes(1)
    expect(cacheGet).toBeCalledTimes(1)
    expect(repoGetFullByCode).toBeCalledTimes(1)
  })

  it('Should return campaign if cache exists', async () => {
    // Arrange
    cacheGet.mockReturnValue(JSON.stringify(campaign))

    // Act
    const res = await service.getFullByCode(code)

    // Assert
    expect(res).toStrictEqual(campaign)

    expect(cacheSet).toBeCalledTimes(0)
    expect(cacheGet).toBeCalledTimes(1)
    expect(repoGetFullByCode).toBeCalledTimes(0)
  })
})
