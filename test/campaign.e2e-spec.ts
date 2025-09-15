import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DataSource, Repository } from 'typeorm'
import { Campaign } from '@/domain/campaign/entity/campaign.entity'
import { Stream } from '@/domain/campaign/entity/stream.entity'
import { CampaignStreamSchema, StreamActionType } from '@/domain/campaign/types'
import { StreamOffer } from '@/domain/campaign/entity/stream-offer.entity'
import { createAuthUser } from './utils/helpers'
import { OfferBuilder } from './utils/entity-builder/offer-builder'
import { faker } from '@faker-js/faker/.'
import { CampaignBuilder } from './utils/entity-builder/campaign-builder'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'

describe('CampaignController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let campaignRepository: Repository<Campaign>
  let streamRepository: Repository<Stream>
  let streamOfferRepository: Repository<StreamOffer>
  let dataSource: DataSource
  let userId: string

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await truncateTables()
    app = await createApp()

    const authData = await createAuthUser(app)
    dataSource = app.get(DataSource)
    campaignRepository = dataSource.getRepository(Campaign)
    streamRepository = dataSource.getRepository(Stream)
    streamOfferRepository = dataSource.getRepository(StreamOffer)
    userId = authData.user.id
    accessToken = authData.accessToken
  })

  describe('Create', () => {
    it('Should be create campaign and stream', async () => {
      const offer1 = await OfferBuilder.create()
        .name('Offer 1')
        .userId(userId)
        .url(faker.internet.url())
        .save(dataSource)

      const offer2 = await OfferBuilder.create()
        .name('Offer 2')
        .userId(userId)
        .url(faker.internet.url())
        .save(dataSource)

      await request(app.getHttpServer())
        .post('/api/campaign')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Test campaign 1',
          active: true,
          streams: [
            {
              name: 'Test stream 1',
              schema: 'LANDINGS_OFFERS',
              offers: [
                {
                  offerId: offer1.id,
                  percent: 40,
                  active: true,
                },
                {
                  offerId: offer2.id,
                  percent: 60,
                  active: true,
                },
              ],
            },
          ],
        })
        .expect(201)

      const campaign = await campaignRepository.findOne({
        where: { name: 'Test campaign 1' },
      })

      const stream = await streamRepository.findOneBy({
        name: 'Test stream 1',
      })

      expect(campaign).not.toBeNull()
      expect(stream).not.toBeNull()
    })

    it('Should not be created with a non-existent sourceId', async () => {
      await request(app.getHttpServer())
        .post('/api/campaign')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Test campaign',
          active: true,
          sourceId: 'e86c9c8f-190e-411b-a468-4eec2fafae01',
          streams: [
            { name: 'Stream 1', schema: 'ACTION', actionType: 'NOTHING' },
          ],
        })
        .expect(404)
        .expect(/Source not found/)
    })

    it('Should not be created with an existing name', async () => {
      await CampaignBuilder.create()
        .name('Campaign 1')
        .code('abcdif')
        .userId(userId)
        .save(dataSource)

      await request(app.getHttpServer())
        .post('/api/campaign')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            { name: 'Stream 1', schema: 'ACTION', actionType: 'NOTHING' },
          ],
        })
        .expect(409)
    })

    it('Should not be created with a non-existent actionCampaignId', async () => {
      await request(app.getHttpServer())
        .post('/api/campaign')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Test campaign 1',
          active: true,
          streams: [
            {
              name: 'Stream 1',
              schema: 'ACTION',
              actionType: 'TO_CAMPAIGN',
              actionCampaignId: 'a9500dd3-595d-4893-9ec1-ce68d0c24ef9',
            },
          ],
        })
        .expect(404)
    })

    it('There must be an error in percentage amount', async () => {
      await request(app.getHttpServer())
        .post('/api/campaign')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Test campaign 1',
          active: true,
          streams: [
            {
              name: 'Stream 1',
              schema: 'LANDINGS_OFFERS',
              offers: [
                {
                  offerId: '00000000-0000-4000-8000-000000000001',
                  percent: 33,
                  active: true,
                },
                {
                  offerId: '00000000-0000-4000-8000-000000000002',
                  percent: 60,
                  active: true,
                },
              ],
            },
          ],
        })
        .expect(400)
        .expect(/Sum of the percentages should be 100/)
    })

    it('There must be an error about duplicate offers', async () => {
      await request(app.getHttpServer())
        .post('/api/campaign')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Test campaign 1',
          active: true,
          streams: [
            {
              name: 'Stream 1',
              schema: 'LANDINGS_OFFERS',
              offers: [
                {
                  offerId: '00000000-0000-4000-8000-000000000001',
                  percent: 40,
                  active: true,
                },
                {
                  offerId: '00000000-0000-4000-8000-000000000001',
                  percent: 60,
                  active: true,
                },
              ],
            },
          ],
        })
        .expect(400)
        .expect(/Offers should not be repeated/)
    })

    it('There must be an error for non-existent offers', async () => {
      await request(app.getHttpServer())
        .post('/api/campaign')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Test campaign 1',
          active: true,
          streams: [
            {
              name: 'Stream 1',
              schema: 'LANDINGS_OFFERS',
              offers: [
                {
                  offerId: '00000000-0000-4000-8000-000000000001',
                  percent: 40,
                  active: true,
                },
                {
                  offerId: '00000000-0000-4000-8000-0000fff00001',
                  percent: 60,
                  active: true,
                },
              ],
            },
          ],
        })
        .expect(404)
        .expect(/Some offers not found/)
    })
  })

  describe('Update', () => {
    it('Must be an error with the existing name', async () => {
      await CampaignBuilder.create()
        .name('Campaign 2')
        .code('abcdif')
        .userId(userId)
        .save(dataSource)

      const campaign = await CampaignBuilder.create()
        .name('Campaign 1')
        .code('abcdi2')
        .userId(userId)
        .createSource((source) => source.name('Source 1').userId(userId))
        .save(dataSource)

      await request(app.getHttpServer())
        .put('/api/campaign/' + campaign.id)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 2',
          active: true,
          sourceId: campaign.source!.id,
          streams: [
            {
              name: 'Test stream 1',
              schema: 'ACTION',
              actionType: 'NOTHING',
            },
          ],
        })
        .expect(409)
    })

    it('Should not be an error with existing streamIds', async () => {
      const campaign = await CampaignBuilder.create()
        .name('Campaign 3')
        .code('abcdif')
        .userId(userId)
        .addStreamTypeAction((stream) =>
          stream.type(StreamActionType.SHOW_TEXT).name('Stream 1'),
        )
        .save(dataSource)

      await request(app.getHttpServer())
        .put('/api/campaign/' + campaign.id)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            {
              id: campaign.streams[0].id,
              name: 'Test stream 1',
              schema: 'ACTION',
              actionType: 'NOTHING',
            },
          ],
        })
        .expect(200)
    })

    it('Must be an error with non existing streamIds', async () => {
      const campaign = await CampaignBuilder.create()
        .name('Campaign 1')
        .code('abcdif')
        .userId(userId)
        .save(dataSource)

      await request(app.getHttpServer())
        .put('/api/campaign/' + campaign.id)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            {
              id: '00000000-0000-4000-8000-000001000001',
              name: 'Test stream 1',
              schema: 'ACTION',
              actionType: 'NOTHING',
            },
          ],
        })
        .expect(404)
    })

    it('Check deleteOldStreams', async () => {
      const campaign = await CampaignBuilder.create()
        .name('Campaign 3')
        .code('abcdif')
        .userId(userId)
        .addStreamTypeAction((stream) =>
          stream.type(StreamActionType.SHOW_TEXT).name('Stream 1'),
        )
        .save(dataSource)

      const streamId = campaign.streams[0].id

      const streamBeforeDelete = await streamRepository.findOneBy({
        id: streamId,
      })

      await request(app.getHttpServer())
        .put('/api/campaign/' + campaign.id)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            {
              name: 'Test stream 1',
              schema: 'ACTION',
              actionType: 'NOTHING',
            },
          ],
        })
        .expect(200)

      const streamAfterDelete = await streamRepository.findOneBy({
        id: streamId,
      })

      const newStream = await streamRepository.findOneBy({
        name: 'Test stream 1',
      })

      expect(streamBeforeDelete).not.toBeNull()
      expect(streamAfterDelete).toBeNull()
      expect(newStream).toBeDefined()
    })

    it('Should expect 404 if campaign not exists', async () => {
      await request(app.getHttpServer())
        .put('/api/campaign/' + faker.string.uuid())
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            {
              name: 'Test stream 1',
              schema: 'ACTION',
              actionType: 'NOTHING',
            },
          ],
        })
        .expect(404)
        .expect({
          message: 'Campaign not found',
          error: 'Not Found',
          statusCode: 404,
        })
    })

    it('Check campaign self referencing', async () => {
      const campaign = await CampaignBuilder.create()
        .name('Campaign 3')
        .code('abcdif')
        .userId(userId)
        .addStreamTypeAction((stream) =>
          stream.type(StreamActionType.SHOW_TEXT).name('Stream 1'),
        )
        .save(dataSource)

      async function sendRequest(withId: boolean): Promise<void> {
        await request(app.getHttpServer())
          .put('/api/campaign/' + campaign.id)
          .auth(accessToken, { type: 'bearer' })
          .send({
            name: 'Campaign 1',
            active: true,
            streams: [
              {
                id: withId ? campaign.streams[0].id : undefined,
                name: 'Test stream 1',
                schema: 'ACTION',
                actionType: StreamActionType.TO_CAMPAIGN,
                actionCampaignId: campaign.id,
              },
            ],
          })
          .expect(400)
          .expect(/Company should not refer to itself/)
      }

      await sendRequest(false)
      await sendRequest(true)
    })

    it('Check deleteOldStreamOffers', async () => {
      const campaign = await CampaignBuilder.create()
        .name('Campaign 3')
        .code('abcdif')
        .userId(userId)
        .addStreamTypeOffers((stream) =>
          stream
            .name('Stream 1')
            .addOffer((streamOffer) =>
              streamOffer
                .percent(100)
                .createOffer((offer) =>
                  offer
                    .name('Offer 1')
                    .url(faker.internet.url())
                    .userId(userId),
                ),
            ),
        )
        .save(dataSource)

      const streamId = campaign.streams[0].id
      const streamOfferId = campaign.streams[0].streamOffers![0].id
      const offerId = campaign.streams[0].streamOffers![0].offerId

      const streamOfferBeforeDelete = await streamOfferRepository.findOneBy({
        id: streamOfferId,
      })

      await request(app.getHttpServer())
        .put('/api/campaign/' + campaign.id)
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            {
              id: streamId,
              name: 'Test stream 1',
              schema: CampaignStreamSchema.LANDINGS_OFFERS,
              offers: [
                {
                  offerId,
                  percent: 100,
                  active: true,
                },
              ],
            },
          ],
        })
        .expect(200)

      const streamOfferAfterDelete = await streamOfferRepository.findOneBy({
        id: streamOfferId,
      })

      expect(streamOfferBeforeDelete).not.toBeNull()
      expect(streamOfferAfterDelete).toBeNull()
    })
  })
})
