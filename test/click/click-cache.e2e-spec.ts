import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { createAuthUser, spyOn } from '../utils/helpers'
import { StreamActionType } from '@/domain/campaign/types'
import { ClickRequestBuilder } from '../utils/click-request-builder'
import { SourceBuilder } from '../utils/entity-builder/source-builder'
import request from 'supertest'
import { CampaignRepository } from '@/infra/repositories/campaign.repository'
import { AffiliateNetworkBuilder } from '../utils/entity-builder/affiliate-network-builder'
import { faker } from '@faker-js/faker/.'
import { OfferBuilder } from '../utils/entity-builder/offer-builder'
import { CreateCampaignService } from '@/domain/campaign/create-campaign.service'

describe('Click-cache (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let userId: string
  let campaignRepository: CampaignRepository
  const code = 'abcdif'
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
    dataSource = app.get(DataSource)
    campaignRepository = app.get(CampaignRepository)
    const authData = await createAuthUser(app)
    userId = authData.user.id
    accessToken = authData.accessToken
    getFullByCode = jest.spyOn(campaignRepository, 'getFullByCode')
  })

  it('Checks cache work', async () => {
    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .addStreamTypeAction((stream) => {
        stream
          .name('Stream 1')
          .type(StreamActionType.SHOW_TEXT)
          .content('Campaign content')
      })
      .save(dataSource)

    const getFullByCode = jest.spyOn(campaignRepository, 'getFullByCode')

    // Act
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()
    await ClickRequestBuilder.create(app).code(code).waitRegister().request()

    // Assert
    expect(getFullByCode).toBeCalledTimes(1)
  })

  it('Checks reset cache if campaign updated', async () => {
    const campaign = await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .addStreamTypeAction((stream) => {
        stream
          .name('Stream 1')
          .type(StreamActionType.SHOW_TEXT)
          .content('Campaign content')
      })
      .save(dataSource)

    // Act
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
      .save(dataSource)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .sourceId(source.id)
      .code(code)
      .userId(userId)
      .addStreamTypeAction((stream) => {
        stream
          .name('Stream 1')
          .type(StreamActionType.SHOW_TEXT)
          .content('Campaign content')
      })
      .save(dataSource)

    // Act
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
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Network 1')
      .userId(userId)
      .save(dataSource)

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
      .save(dataSource)

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
    const offer = await OfferBuilder.create()
      .name('Offer 1')
      .userId(userId)
      .url(faker.internet.url())
      .save(dataSource)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .addStreamTypeOffers((stream) => {
        stream
          .name('Stream 1')
          .addOffer((builder) => builder.percent(100).offerId(offer.id))
      })
      .save(dataSource)

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

  it('Checks cache for not exists campaign', async () => {
    // Act
    await ClickRequestBuilder.create(app).code(code).request().expect(404)
    await ClickRequestBuilder.create(app).code(code).request().expect(404)

    // Assert
    expect(getFullByCode).toBeCalledTimes(1)
  })

  it('Checks cache for not exists campaign then after create', async () => {
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
