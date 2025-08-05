import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource, Repository } from 'typeorm'
import { Offer } from '@/offer/offer.entity'
import { OfferBuilder } from '@/utils/entity-builder/offer-builder'
import { faker } from '@faker-js/faker/.'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { createAuthUser } from './utils/helpers'

describe('OfferController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let offerRepository: Repository<Offer>
  let dataSource: DataSource
  let userId: string

  afterEach(async () => {
    await truncateTables()
    await app.close()
  })

  beforeEach(async () => {
    app = await createApp()
    dataSource = app.get(DataSource)
    offerRepository = dataSource.getRepository(Offer)
    const authData = await createAuthUser(app)
    accessToken = authData.accessToken
    userId = authData.user.id
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
    await OfferBuilder.create()
      .name('Offer 1')
      .userId(userId)
      .url(faker.internet.url())
      .save(dataSource)

    const { body } = await request(app.getHttpServer())
      .get('/api/offer')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBe(1)
  })

  it('Обновление offer, при этом нельзя обновить id', async () => {
    const offer = await OfferBuilder.create()
      .name('Offer 1')
      .userId(userId)
      .url(faker.internet.url())
      .save(dataSource)

    await request(app.getHttpServer())
      .patch('/api/offer/' + offer.id)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const source = await offerRepository.findOneOrFail({
      where: { id: offer.id },
    })

    expect(source.name).toEqual('updated name')
  })

  it('Delete offer', async () => {
    const offer = await OfferBuilder.create()
      .name('Offer 1')
      .userId(userId)
      .url(faker.internet.url())
      .save(dataSource)

    await request(app.getHttpServer())
      .delete('/api/offer/' + offer.id)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const source = await offerRepository.findOneBy({
      id: offer.id,
    })

    expect(source).toBeNull()
  })
})
