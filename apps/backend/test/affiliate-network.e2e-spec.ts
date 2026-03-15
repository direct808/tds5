import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAuthUser } from './utils/helpers'
import { AffiliateNetworkBuilder } from './utils/entity-builder/affiliate-network-builder'
import { UserBuilder } from './utils/entity-builder/user-builder'
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
      .delete('/api/affiliate-network')
      .send({ ids: [affiliateNetwork.id] })
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const deletedSource = await prisma.affiliateNetwork.findFirstOrThrow({
      where: { id: affiliateNetwork.id },
    })

    expect(deletedSource.deletedAt).not.toBeNull()
  })

  it('List excludes soft-deleted affiliate networks', async () => {
    await AffiliateNetworkBuilder.create()
      .name('Active')
      .userId(userId)
      .save(prisma)
    await AffiliateNetworkBuilder.create()
      .name('Deleted')
      .userId(userId)
      .deletedAt(new Date())
      .save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/affiliate-network')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': ['clicks'],
        limit: 10,
        timezone: '+00:00',
        rangeInterval: 'today',
        sortField: 'name',
        sortOrder: 'asc',
      })
      .expect(200)

    expect(body.total).toBe(1)
    expect(body.rows).toHaveLength(1)
    expect(body.rows[0].name).toBe('Active')
  })

  describe('Get affiliate network by id', () => {
    it('Should return affiliate network with correct fields', async () => {
      const affiliateNetwork = await AffiliateNetworkBuilder.create()
        .name('Network 1')
        .userId(userId)
        .offerParams('param1=value1')
        .save(prisma)

      const { body } = await request(app.getHttpServer())
        .get('/api/affiliate-network/' + affiliateNetwork.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(200)

      expect(body).toEqual({
        id: affiliateNetwork.id,
        name: 'Network 1',
        offerParams: 'param1=value1',
      })
    })

    it('Should not expose internal fields', async () => {
      const affiliateNetwork = await AffiliateNetworkBuilder.create()
        .name('Network 1')
        .userId(userId)
        .save(prisma)

      const { body } = await request(app.getHttpServer())
        .get('/api/affiliate-network/' + affiliateNetwork.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(200)

      expect(body).not.toHaveProperty('userId')
      expect(body).not.toHaveProperty('deletedAt')
    })

    it('Should return 404 if affiliate network not found', async () => {
      await request(app.getHttpServer())
        .get('/api/affiliate-network/00000000-0000-4000-8000-000000000099')
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
    })

    it('Should return 404 if affiliate network belongs to another user', async () => {
      const otherUser = await UserBuilder.create()
        .login('other')
        .password('pass')
        .save(prisma)

      const affiliateNetwork = await AffiliateNetworkBuilder.create()
        .name('Network 1')
        .userId(otherUser.id)
        .save(prisma)

      await request(app.getHttpServer())
        .get('/api/affiliate-network/' + affiliateNetwork.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
    })

    it('Should return 404 for soft-deleted affiliate network', async () => {
      const affiliateNetwork = await AffiliateNetworkBuilder.create()
        .name('Network 1')
        .userId(userId)
        .deletedAt(new Date())
        .save(prisma)

      await request(app.getHttpServer())
        .get('/api/affiliate-network/' + affiliateNetwork.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
    })
  })

  it('Get affiliate-network columns', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/affiliate-network/columns')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(Array.isArray(body)).toBe(true)
    body.forEach((item: { column: string; name: string; default: boolean }) => {
      expect(typeof item.column).toBe('string')
      expect(typeof item.name).toBe('string')
      expect(typeof item.default).toBe('boolean')
    })

    const columns: string[] = body.map(
      (item: { column: string }) => item.column,
    )
    expect(columns).toContain('offers')
    expect(columns).toContain('clicks')
    expect(columns).toContain('roi')

    const defaults = body
      .filter((item: { default: boolean }) => item.default)
      .map((item: { column: string }) => item.column)
    expect(defaults).toContain('clicks')
    expect(defaults).toContain('roi')
    expect(defaults).not.toContain('offers')
  })
})
