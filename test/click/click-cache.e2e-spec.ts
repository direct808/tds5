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
import { CreateCampaignService } from '@/domain/campaign/create-campaign.service'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { ClickRequestBuilder } from '../utils/click-builders/click-request-builder'
import { DomainBuilder } from '../utils/entity-builder/domain-builder'

describe('Click-cache (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userId: string
  let campaignRepository: CampaignRepository
  let accessToken: string
  let getFullByCode: jest.SpyInstance

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
    campaignRepository = app.get(CampaignRepository)
    const authData = await createAuthUser(app)
    userId = authData.user.id
    accessToken = authData.accessToken
    getFullByCode = jest.spyOn(campaignRepository, 'getFullBy')
  })

  it('Checks cache work', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    const getFullByCode = jest.spyOn(campaignRepository, 'getFullBy')

    // Act
    const { code } = campaign
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()

    // Assert
    expect(getFullByCode).toBeCalledTimes(1)
  })

  it('Checks reset cache if campaign updated', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    // Act
    const { code } = campaign
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()

    await request(app.getHttpServer())
      .put('/api/campaign/' + campaign.id)
      .auth(accessToken, { type: 'bearer' })
      .send(campaign)
      .expect(200)

    await ClickRequestBuilder.create(app).code(code).waitRegister().request()

    // Assert
    expect(getFullByCode).toBeCalledTimes(2)
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
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()

    await request(app.getHttpServer())
      .patch('/api/source/' + source.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    await ClickRequestBuilder.create(app).code(code).waitRegister().request()

    // Assert
    expect(getFullByCode).toBeCalledTimes(2)
  })

  it('Checks reset cache if affiliateNetwork updated', async () => {
    const code = 'abcdif'
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
    await ClickRequestBuilder.create(app)
      .code(code)
      .waitRegister()
      .request()
      .expect(302)

    await ClickRequestBuilder.create(app)
      .code(code)
      .waitRegister()
      .request()
      .expect(302)

    await request(app.getHttpServer())
      .patch('/api/affiliate-network/' + affiliateNetwork.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    await ClickRequestBuilder.create(app)
      .code(code)
      .waitRegister()
      .request()
      .expect(302)

    // Assert
    expect(getFullByCode).toBeCalledTimes(2)
  })

  it('Checks reset cache if offer updated', async () => {
    const code = 'abcdif'
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

    // Act
    await ClickRequestBuilder.create(app)
      .code(code)
      .waitRegister()
      .request()
      .expect(302)

    await ClickRequestBuilder.create(app)
      .code(code)
      .waitRegister()
      .request()
      .expect(302)

    await request(app.getHttpServer())
      .patch('/api/offer/' + offer.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    await ClickRequestBuilder.create(app)
      .code(code)
      .waitRegister()
      .request()
      .expect(302)

    // Assert
    expect(getFullByCode).toBeCalledTimes(2)
  })

  it('Checks reset cache if domain updated', async () => {
    const domainName = 'test.com'
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    const domain = await DomainBuilder.create()
      .name(domainName)
      .indexPageCampaignId(campaign.id)
      .userId(userId)
      .save(prisma)

    // Act
    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()
    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()

    await request(app.getHttpServer())
      .patch('/api/domain/' + domain.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ intercept404: true })
      .expect(200)

    await ClickRequestBuilder.create(app)
      .domain(domainName)
      .waitRegister()
      .request()

    // Assert
    expect(getFullByCode).toBeCalledTimes(2)
  })

  it('Checks cache for not exists campaign', async () => {
    const code = 'abcdif'
    // Act
    await ClickRequestBuilder.create(app).code(code).request().expect(404)
    await ClickRequestBuilder.create(app).code(code).request().expect(404)

    // Assert
    expect(getFullByCode).toBeCalledTimes(1)
  })

  it('Checks cache for not exists campaign then after create', async () => {
    const code = 'abcdif'
    // Act
    await ClickRequestBuilder.create(app).code(code).request().expect(404)
    await ClickRequestBuilder.create(app).code(code).request().expect(404)

    spyOn(app.get(CreateCampaignService), 'makeCode').mockReturnValue(code)

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

    await ClickRequestBuilder.create(app)
      .code(code)
      .waitRegister()
      .request()
      .expect(200)

    // Assert
    expect(getFullByCode).toBeCalledTimes(2)
  })
})
