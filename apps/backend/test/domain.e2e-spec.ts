import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAuthUser } from './utils/helpers'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { PrismaService } from '../src/infra/prisma/prisma.service'
import { createCampaignContent } from './utils/campaign-builder-facades/create-campaign-content'
import { faker } from '@faker-js/faker'
import { DomainBuilder } from './utils/entity-builder/domain-builder'
import { CampaignBuilder } from './utils/entity-builder/campaign-builder'

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

  it('List domain', async () => {
    await DomainBuilder.create()
      .name('test.com')
      .userId(userId)
      .intercept404(true)
      .save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/domain')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual(expect.any(Array))
    expect(body.length).toBe(1)
    expect(body).toEqual([
      expect.objectContaining({
        name: 'test.com',
        intercept404: true,
        userId,
      }),
    ])
  })

  it('Update domain', async () => {
    const campaign = await createCampaignContent({ userId, prisma })
    const domain = await DomainBuilder.create()
      .name('test.com')
      .userId(userId)
      .intercept404(false)
      .save(prisma)

    await request(app.getHttpServer())
      .patch('/api/domain/' + domain.id)
      .auth(accessToken, { type: 'bearer' })
      .send({
        id: '00000000-0000-4000-8000-000000000022',
        name: 'test2.com',
        intercept404: true,
        indexPageCampaignId: campaign.id,
      })
      .expect(200)

    const domainExists = await prisma.domain.findFirstOrThrow({
      where: { id: domain.id },
    })

    expect(domainExists).toEqual(
      expect.objectContaining({
        id: domain.id,
        name: 'test.com',
        intercept404: true,
        indexPageCampaignId: campaign.id,
      }),
    )
  })

  it('Delete domain', async () => {
    const domain = await DomainBuilder.create()
      .name('test.com')
      .userId(userId)
      .intercept404(false)
      .save(prisma)

    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .domainId(domain.id)
      .save(prisma)

    await request(app.getHttpServer())
      .delete('/api/domain/' + domain.id)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const domainDB = await prisma.domain.findFirst({
      where: { id: domain.id },
    })

    const campaignDB = await prisma.campaign.findFirstOrThrow({
      where: { id: campaign.id },
    })

    expect(domainDB).toBeNull()
    expect(campaignDB.domainId).toBeNull()
  })
})
