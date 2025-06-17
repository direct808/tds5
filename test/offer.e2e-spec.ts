import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { DataSource, Repository } from 'typeorm'
import {
  authUser,
  loadAffiliateNetworkFixtures,
  loadOfferFixtures,
  loadUserFixtures,
} from './utils/helpers'
import { configureApp } from '../src/utils/configure-app'
import { Offer } from '../src/offer/offer.entity'

describe('OfferController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let offerRepository: Repository<Offer>

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
    await loadUserFixtures(dataSource)
    await loadAffiliateNetworkFixtures(dataSource)
    await loadOfferFixtures(dataSource)
    offerRepository = dataSource.getRepository(Offer)
    accessToken = await authUser(app)
  })

  describe('Create', () => {
    it('Should be create', async () => {
      await request(app.getHttpServer())
        .post('/api/offer')
        .auth(accessToken, { type: 'bearer' })
        .send({ name: 'Test offer 1', url: 'http://google.com' })
        .expect(201)

      const offer = await offerRepository.findOne({
        where: { name: 'Test offer 1' },
      })

      expect(offer).not.toBeNull()
    })
  })

  it('List offers', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/offer')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
  })

  it('Обновление offer, при этом нельзя обновить id у source', async () => {
    await request(app.getHttpServer())
      .patch('/api/offer/00000000-0000-4000-8000-000000000001')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const source = await offerRepository.findOneOrFail({
      where: { id: '00000000-0000-4000-8000-000000000001' },
    })

    expect(source.name).toEqual('updated name')
  })

  it('Delete offer', async () => {
    await request(app.getHttpServer())
      .delete('/api/offer/00000000-0000-4000-8000-000000000001')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const source = await offerRepository.findOneBy({
      id: '00000000-0000-4000-8000-000000000001',
    })

    expect(source).toBeNull()
  })
})
