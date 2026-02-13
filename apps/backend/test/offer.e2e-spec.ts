import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { OfferBuilder } from './utils/entity-builder/offer-builder'
import { faker } from '@faker-js/faker/.'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { createAuthUser } from './utils/helpers'
import { PrismaService } from '../src/infra/prisma/prisma.service'

describe('OfferController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let prisma: PrismaService
  let userId: string

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await truncateTables()
    app = await createApp()
    prisma = app.get(PrismaService)
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

      const offer = await prisma.offer.findFirst({
        where: { name: 'Test offer 1' },
      })

      expect(offer).not.toBeNull()
    })
  })

  it('Обновление offer, при этом нельзя обновить id', async () => {
    const offer = await OfferBuilder.create()
      .name('Offer 1')
      .userId(userId)
      .url(faker.internet.url())
      .save(prisma)

    await request(app.getHttpServer())
      .patch('/api/offer/' + offer.id)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const source = await prisma.offer.findFirstOrThrow({
      where: { id: offer.id },
    })

    expect(source.name).toEqual('updated name')
  })

  it('Delete offer', async () => {
    const offer = await OfferBuilder.create()
      .name('Offer 1')
      .userId(userId)
      .url(faker.internet.url())
      .save(prisma)

    await request(app.getHttpServer())
      .delete('/api/offer')
      .send({ ids: [offer.id] })
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const source = await prisma.offer.findFirst({
      where: { id: offer.id },
    })

    expect(source).toBeNull()
  })
})
