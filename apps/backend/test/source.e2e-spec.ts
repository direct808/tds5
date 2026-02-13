import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAuthUser } from './utils/helpers'
import { SourceBuilder } from './utils/entity-builder/source-builder'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { PrismaService } from '../src/infra/prisma/prisma.service'

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

    const sourceExists = await prisma.source.findFirst({
      where: { id: source.id },
    })

    expect(sourceExists).toBeNull()
  })
})
