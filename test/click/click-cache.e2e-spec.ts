import { INestApplication } from '@nestjs/common'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { createAuthUser, spyOn } from '../utils/helpers'
import { SourceBuilder } from '../utils/entity-builder/source-builder'
import request from 'supertest'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { AffiliateNetworkBuilder } from '../utils/entity-builder/affiliate-network-builder'
import { faker } from '@faker-js/faker/.'
import { OfferBuilder } from '../utils/entity-builder/offer-builder'
import { CreateCampaignUseCase } from '@/domain/campaign/use-cases/create-campaign.use-case'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { ClickRequestBuilder } from '../utils/click-builders/click-request-builder'
import { DomainBuilder } from '../utils/entity-builder/domain-builder'
import { setTimeout } from 'timers/promises'
import { RedisProvider } from '@/infra/redis/redis.provider'
import {
  affiliateNetworkCacheKey,
  fullCampaignCodeCacheKey,
  fullCampaignDomainCacheKey,
  offerCacheKey,
  sourceCacheKey,
} from '@/domain/campaign-cache/helpers/campaign-cache-keys'

describe('Click-cache (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userId: string
  let campaignRepository: CampaignRepository
  let cache: RedisProvider
  let accessToken: string
  let getFullBy: jest.SpyInstance
  const domainName = 'test.com'
  const code = 'abcdif'

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    app = await createApp()
    prisma = app.get(PrismaService)
    cache = app.get(RedisProvider)
    campaignRepository = app.get(CampaignRepository)
    const authData = await createAuthUser(app)
    userId = authData.user.id
    accessToken = authData.accessToken
    getFullBy = jest.spyOn(campaignRepository, 'getFullBy')
  })

  it('Checks cache work', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    const getFullByCode = jest.spyOn(campaignRepository, 'getFullBy')

    const { code } = campaign
    await clickAndWaitRegister(app, code)
    expect(getFullByCode).toHaveBeenCalledTimes(1)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).not.toBeNull()

    await clickAndWaitRegister(app, code)
    expect(getFullByCode).toHaveBeenCalledTimes(1)
  })

  it('Checks reset cache if campaign updated', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .addIndexPageDomain((builder) => builder.name(domainName).userId(userId))
      .save(prisma)

    // Act
    const { code } = campaign
    await clickAndWaitRegister(app, code)
    expect(getFullBy).toHaveBeenCalledTimes(1)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).not.toBeNull()

    await clickAndWaitRegister(app, code)
    expect(getFullBy).toHaveBeenCalledTimes(1)

    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()
    expect(getFullBy).toHaveBeenCalledTimes(2)

    await request(app.getHttpServer())
      .put('/api/campaign/' + campaign.id)
      .auth(accessToken, { type: 'bearer' })
      .send(campaign)
      .expect(200)

    expect(await cache.get(fullCampaignCodeCacheKey(code))).toBeNull()
    await clickAndWaitRegister(app, code)
    expect(getFullBy).toHaveBeenCalledTimes(3)

    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()
    expect(getFullBy).toHaveBeenCalledTimes(4)
  })

  it('Checks reset cache if source updated', async () => {
    const source = await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(prisma)

    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .sourceId(source.id)
      .save(prisma)

    // Act
    const { code } = campaign
    await clickAndWaitRegister(app, code)
    expect(getFullBy).toHaveBeenCalledTimes(1)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).not.toBeNull()
    expect(await cache.sMembers(sourceCacheKey(source.id))).toHaveLength(1)

    await clickAndWaitRegister(app, code)
    expect(getFullBy).toHaveBeenCalledTimes(1)

    await request(app.getHttpServer())
      .patch('/api/source/' + source.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    await setTimeout(100)

    expect(await cache.get(fullCampaignCodeCacheKey(code))).toBeNull()
    expect(await cache.sMembers(sourceCacheKey(source.id))).toHaveLength(0)

    await clickAndWaitRegister(app, code)
    expect(getFullBy).toHaveBeenCalledTimes(2)
  })

  it('Checks reset cache if affiliateNetwork updated', async () => {
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Network 1')
      .userId(userId)
      .save(prisma)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .addStreamTypeOffers((stream) => {
        stream
          .name('Stream 1')
          .addOffer((offer) =>
            offer
              .percent(100)
              .createOffer((offer) =>
                offer
                  .name('offer')
                  .url(faker.internet.url())
                  .userId(userId)
                  .affiliateNetworkId(affiliateNetwork.id),
              ),
          )
      })
      .save(prisma)

    // Act
    await clickAndWaitRegister(app, code).expect(302)
    expect(getFullBy).toHaveBeenCalledTimes(1)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).not.toBeNull()
    expect(
      await cache.sMembers(affiliateNetworkCacheKey(affiliateNetwork.id)),
    ).toHaveLength(1)

    await clickAndWaitRegister(app, code).expect(302)
    expect(getFullBy).toHaveBeenCalledTimes(1)

    await request(app.getHttpServer())
      .patch('/api/affiliate-network/' + affiliateNetwork.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    await setTimeout(100)

    expect(await cache.get(fullCampaignCodeCacheKey(code))).toBeNull()
    expect(
      await cache.sMembers(affiliateNetworkCacheKey(affiliateNetwork.id)),
    ).toHaveLength(0)

    await clickAndWaitRegister(app, code).expect(302)

    // Assert
    expect(getFullBy).toHaveBeenCalledTimes(2)
  })

  it('Checks reset cache if offer updated', async () => {
    const offer = await OfferBuilder.create()
      .name('Offer 1')
      .userId(userId)
      .url(faker.internet.url())
      .save(prisma)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .addStreamTypeOffers((stream) => {
        stream
          .name('Stream 1')
          .addOffer((builder) => builder.percent(100).offerId(offer.id))
      })
      .save(prisma)

    await clickAndWaitRegister(app, code).expect(302)
    expect(getFullBy).toHaveBeenCalledTimes(1)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).not.toBeNull()
    expect(await cache.sMembers(offerCacheKey(offer.id))).toHaveLength(1)

    await clickAndWaitRegister(app, code).expect(302)
    expect(getFullBy).toHaveBeenCalledTimes(1)

    await request(app.getHttpServer())
      .patch('/api/offer/' + offer.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    await setTimeout(100)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).toBeNull()
    expect(await cache.sMembers(offerCacheKey(offer.id))).toHaveLength(0)

    await clickAndWaitRegister(app, code).expect(302)
    expect(getFullBy).toHaveBeenCalledTimes(2)
  })

  it('Checks reset cache if domain updated', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    const domain = await DomainBuilder.create()
      .name(domainName)
      .indexPageCampaignId(campaign.id)
      .userId(userId)
      .save(prisma)

    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()
    expect(getFullBy).toHaveBeenCalledTimes(1)
    expect(
      await cache.get(fullCampaignDomainCacheKey(domainName)),
    ).not.toBeNull()

    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()
    expect(getFullBy).toHaveBeenCalledTimes(1)

    await request(app.getHttpServer())
      .patch('/api/domain/' + domain.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ intercept404: true })
      .expect(200)

    expect(await cache.get(fullCampaignDomainCacheKey(domainName))).toBeNull()

    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()
    expect(getFullBy).toHaveBeenCalledTimes(2)
  })

  it('Checks cache for not exists campaign', async () => {
    await ClickRequestBuilder.create(app).code(code).request().expect(404)
    expect(getFullBy).toHaveBeenCalledTimes(1)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).toBe('N')

    await ClickRequestBuilder.create(app).code(code).request().expect(404)
    expect(getFullBy).toHaveBeenCalledTimes(1)
  })

  it('Checks cache for not exists campaign then after create', async () => {
    await ClickRequestBuilder.create(app).code(code).request().expect(404)
    expect(getFullBy).toHaveBeenCalledTimes(1)
    expect(await cache.get(fullCampaignCodeCacheKey(code))).toBe('N')

    await ClickRequestBuilder.create(app).code(code).request().expect(404)
    expect(getFullBy).toHaveBeenCalledTimes(1)

    spyOn(app.get(CreateCampaignUseCase), 'makeCode').mockReturnValue(code)

    await request(app.getHttpServer())
      .post('/api/campaign')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'Campaign 1',
        active: true,
        streams: [
          {
            name: 'Stream 1',
            schema: 'ACTION',
            actionType: 'SHOW_TEXT',
            actionContent: 'CONTENT',
          },
        ],
      })
      .expect(201)

    expect(await cache.get(fullCampaignCodeCacheKey(code))).toBeNull()

    await clickAndWaitRegister(app, code).expect(200)

    expect(getFullBy).toHaveBeenCalledTimes(2)
  })
})

function clickAndWaitRegister(
  app: INestApplication,
  code: string,
): ReturnType<ClickRequestBuilder['request']> {
  return ClickRequestBuilder.create(app).code(code).waitRegister().request()
}
