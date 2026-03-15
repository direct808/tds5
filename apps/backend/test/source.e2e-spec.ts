import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAuthUser } from './utils/helpers'
import { SourceBuilder } from './utils/entity-builder/source-builder'
import { UserBuilder } from './utils/entity-builder/user-builder'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('SourceController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let prisma: PrismaService

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

  it('Create source', async () => {
    await request(app.getHttpServer())
      .post('/api/source')
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'Source 1' })
      .expect(201)

    const source = await prisma.source.findFirst({
      where: { name: 'Source 1' },
    })

    expect(source).not.toBeNull()
  })

  it('Обновление source, при этом нельзя обновить id', async () => {
    const source = await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(prisma)

    await request(app.getHttpServer())
      .patch('/api/source/' + source.id)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const sourceExists = await prisma.source.findFirstOrThrow({
      where: { id: source.id },
    })

    expect(sourceExists.name).toEqual('updated name')
  })

  it('Delete source', async () => {
    const source = await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(prisma)

    await request(app.getHttpServer())
      .delete('/api/source')
      .send({ ids: [source.id] })
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const sourceExists = await prisma.source.findFirstOrThrow({
      where: { id: source.id },
    })

    expect(sourceExists.deletedAt).not.toBeNull()
  })

  it('List excludes soft-deleted sources', async () => {
    await SourceBuilder.create().name('Active').userId(userId).save(prisma)
    await SourceBuilder.create()
      .name('Deleted')
      .userId(userId)
      .deletedAt(new Date())
      .save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/source')
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

  describe('Get source by id', () => {
    it('Should return source with correct fields', async () => {
      const source = await SourceBuilder.create()
        .name('Source 1')
        .userId(userId)
        .save(prisma)

      const { body } = await request(app.getHttpServer())
        .get('/api/source/' + source.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(200)

      expect(body).toEqual({
        id: source.id,
        name: 'Source 1',
      })
    })

    it('Should not expose internal fields', async () => {
      const source = await SourceBuilder.create()
        .name('Source 1')
        .userId(userId)
        .save(prisma)

      const { body } = await request(app.getHttpServer())
        .get('/api/source/' + source.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(200)

      expect(body).not.toHaveProperty('userId')
      expect(body).not.toHaveProperty('deletedAt')
    })

    it('Should return 404 if source not found', async () => {
      await request(app.getHttpServer())
        .get('/api/source/00000000-0000-4000-8000-000000000099')
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
    })

    it('Should return 404 if source belongs to another user', async () => {
      const otherUser = await UserBuilder.create()
        .login('other')
        .password('pass')
        .save(prisma)

      const source = await SourceBuilder.create()
        .name('Source 1')
        .userId(otherUser.id)
        .save(prisma)

      await request(app.getHttpServer())
        .get('/api/source/' + source.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
    })

    it('Should return 404 for soft-deleted source', async () => {
      const source = await SourceBuilder.create()
        .name('Source 1')
        .userId(userId)
        .deletedAt(new Date())
        .save(prisma)

      await request(app.getHttpServer())
        .get('/api/source/' + source.id)
        .auth(accessToken, { type: 'bearer' })
        .expect(404)
    })
  })

  it('Get source columns', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/api/source/columns')
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
    expect(columns).toContain('clicks')
    expect(columns).toContain('roi')

    const defaults = body
      .filter((item: { default: boolean }) => item.default)
      .map((item: { column: string }) => item.column)
    expect(defaults).toContain('clicks')
    expect(defaults).toContain('roi')
  })
})
