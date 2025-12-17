import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAuthUser } from './utils/helpers'
import { SourceBuilder } from './utils/entity-builder/source-builder'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { createCampaignContent } from './utils/campaign-builder-facades/create-campaign-content'
import { faker } from '@faker-js/faker'

describe('DomainController (e2e)', () => {
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

  it('Create domain', async () => {
    const campaign = await createCampaignContent({ userId, prisma })

    await request(app.getHttpServer())
      .post('/api/domain')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'test.com',
        indexPageCampaignId: campaign.id,
        intercept404: true,
      })
      .expect(201)

    const domain = await prisma.domain.findFirst()

    expect(domain).toEqual(
      expect.objectContaining({
        name: 'test.com',
        indexPageCampaignId: campaign.id,
        intercept404: true,
        userId,
      }),
    )
  })

  it('Create domain witch non exists indexPageCampaignId', async () => {
    await request(app.getHttpServer())
      .post('/api/domain')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'test.com',
        indexPageCampaignId: faker.string.uuid(),
        intercept404: true,
      })
      .expect(
        400,
        '{"message":"indexPageCampaignId not found","error":"Bad Request","statusCode":400}',
      )
  })

  it.skip('List source', async () => {
    await SourceBuilder.create().name('Source 1').userId(userId).save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/source')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBe(1)
  })

  it.skip('Обновление source, при этом нельзя обновить id', async () => {
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

  it.skip('Delete source', async () => {
    const source = await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(prisma)

    await request(app.getHttpServer())
      .delete('/api/source/' + source.id)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const sourceExists = await prisma.source.findFirst({
      where: { id: source.id },
    })

    expect(sourceExists).toBeNull()
  })
})
