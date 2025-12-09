import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAuthUser } from './utils/helpers'
import { AffiliateNetworkBuilder } from './utils/entity-builder/affiliate-network-builder'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { PrismaClient } from '@generated/prisma/client'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('AffiliateNetworkController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let prisma: PrismaClient

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await truncateTables()
    app = await createApp()
    prisma = app.get(PrismaService)

    const authData = await createAuthUser(app)
    userId = authData.user.id
    accessToken = authData.accessToken
  })

  it('Create affiliate network', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/affiliate-network')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'Network test',
        offerParams: 'OP',
        userId,
        unknownProp: 'Value',
      })
      .expect(201)

    expect(response.body).toEqual({
      id: response.body.id,
      name: 'Network test',
      offerParams: 'OP',
      userId,
      createdAt: response.body.createdAt,
      deletedAt: null,
      updatedAt: response.body.updatedAt,
    })
  })

  it('List Create affiliate network', async () => {
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Af 1')
      .userId(userId)
      .save(prisma)

    const response = await request(app.getHttpServer())
      .get('/api/affiliate-network')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(response.body[0]).toEqual({
      ...affiliateNetwork,
      createdAt: affiliateNetwork.createdAt.toISOString(),
      updatedAt: affiliateNetwork.updatedAt.toISOString(),
    })
  })

  it('Обновление source, при этом нельзя обновить id у affiliate network', async () => {
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Af 1')
      .userId(userId)
      .save(prisma)

    await request(app.getHttpServer())
      .patch('/api/affiliate-network/' + affiliateNetwork.id)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const anFounded = await prisma.affiliateNetwork.findFirstOrThrow({
      where: { id: affiliateNetwork.id },
    })

    expect(anFounded.name).toEqual('updated name')
  })

  it('Delete affiliate network', async () => {
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Af 1')
      .userId(userId)
      .save(prisma)

    await request(app.getHttpServer())
      .delete('/api/affiliate-network/' + affiliateNetwork.id)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const deletedSource = await prisma.affiliateNetwork.findFirst({
      where: { id: affiliateNetwork.id },
    })

    expect(deletedSource).toBeNull()
  })
})
