import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { DataSource, Repository } from 'typeorm'
import { configureApp } from '../src/utils/configure-app'
import { Campaign } from '../src/campaign/entity/campaign.entity'
import {
  CampaignStreamSchema,
  Stream,
  StreamActionType,
} from '../src/campaign/entity/stream.entity'
import { StreamOffer } from '../src/campaign/entity/stream-offer.entity'
import {
  authUser,
  loadAffiliateNetworkFixtures,
  loadCampaignFixtures,
  loadOfferFixtures,
  loadSourceFixtures,
  loadUserFixtures,
} from './utils/helpers'

describe('CampaignController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let campaignRepository: Repository<Campaign>
  let streamRepository: Repository<Stream>
  let streamOfferRepository: Repository<StreamOffer>

  beforeAll(async () => {
    // await createTestContainer()
  })

  afterEach(async () => {
    // await truncateTables(app)
  })

  beforeEach(async () => {
    // process.env.DB_NAME = await createTestDatabase()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    configureApp(app)
    await app.init()
    const dataSource = app.get(DataSource)

    campaignRepository = dataSource.getRepository(Campaign)
    streamRepository = dataSource.getRepository(Stream)
    streamOfferRepository = dataSource.getRepository(StreamOffer)

    await loadUserFixtures(dataSource)
    await loadAffiliateNetworkFixtures(dataSource)
    await loadOfferFixtures(dataSource)
    await loadSourceFixtures(dataSource)
    await loadCampaignFixtures(dataSource)

    accessToken = await authUser(app)
  })

  describe('Create', () => {
    it('Should be create campaign and stream', async () => {
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
                  offerId: '00000000-0000-4000-8000-000000000001',
                  percent: 40,
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
      await request(app.getHttpServer())
        .put('/api/campaign/00000000-0000-4000-8000-000000000001')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 2',
          active: true,
          sourceId: '00000000-0000-4000-8000-000000000001',
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
      await request(app.getHttpServer())
        .put('/api/campaign/00000000-0000-4000-8000-000000000001')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            {
              id: '00000000-0000-4000-8000-000000000001',
              name: 'Test stream 1',
              schema: 'ACTION',
              actionType: 'NOTHING',
            },
          ],
        })
        .expect(200)
    })

    it('Must be an error with non existing streamIds', async () => {
      await request(app.getHttpServer())
        .put('/api/campaign/00000000-0000-4000-8000-000000000001')
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
        .expect(400)
    })

    it('Check deleteOldStreams', async () => {
      const streamBeforeDelete = await streamRepository.findOneBy({
        id: '00000000-0000-4000-8000-000000000001',
      })

      await request(app.getHttpServer())
        .put('/api/campaign/00000000-0000-4000-8000-000000000001')
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
        id: '00000000-0000-4000-8000-000000000001',
      })

      const newStream = await streamRepository.findOneBy({
        name: 'Test stream 1',
      })

      expect(streamBeforeDelete).not.toBeNull()
      expect(streamAfterDelete).toBeNull()
      expect(newStream).toBeDefined()
    })

    it('Check campaign self referencing', async () => {
      async function sendRequest(withId: boolean) {
        await request(app.getHttpServer())
          .put('/api/campaign/00000000-0000-4000-8000-000000000001')
          .auth(accessToken, { type: 'bearer' })
          .send({
            name: 'Campaign 1',
            active: true,
            streams: [
              {
                id: withId ? '00000000-0000-4000-8000-000000000001' : undefined,
                name: 'Test stream 1',
                schema: 'ACTION',
                actionType: StreamActionType.TO_CAMPAIGN,
                actionCampaignId: '00000000-0000-4000-8000-000000000001',
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
      const streamOfferBeforeDelete = await streamOfferRepository.findOneBy({
        id: '00000000-0000-4000-8000-000000000001',
      })

      await request(app.getHttpServer())
        .put('/api/campaign/00000000-0000-4000-8000-000000000001')
        .auth(accessToken, { type: 'bearer' })
        .send({
          name: 'Campaign 1',
          active: true,
          streams: [
            {
              id: '00000000-0000-4000-8000-000000000001',
              name: 'Test stream 1',
              schema: CampaignStreamSchema.LANDINGS_OFFERS,
              offers: [
                {
                  offerId: '00000000-0000-4000-8000-000000000001',
                  percent: 100,
                  active: true,
                },
              ],
            },
          ],
        })
        .expect(200)

      const streamOfferAfterDelete = await streamOfferRepository.findOneBy({
        id: '00000000-0000-4000-8000-000000000001',
      })

      expect(streamOfferBeforeDelete).not.toBeNull()
      expect(streamOfferAfterDelete).toBeNull()
    })
  })
})
