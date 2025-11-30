import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { createAuthUser } from '../utils/helpers'
import { truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { createClicksBuilder } from '../utils/entity-builder/clicks-builder'
import { ReportService } from '@/domain/report/report.service'
import { PrismaService } from '@/infra/prisma/prisma.service'

describe('Report Order (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let prisma: PrismaService
  let metrics: string[]

  afterEach(async () => {
    await app.close()
  })

  beforeAll(async () => {
    await truncateTables()
    app = await createApp()
    prisma = app.get(PrismaService)
    const authData = await createAuthUser(app)
    accessToken = authData.accessToken
    userId = authData.user.id

    const service = app.get(ReportService)
    metrics = service.getAllMetricsFieldNames()

    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    await createClicksBuilder().campaignId(campaign.id).add().save(prisma)
  })

  it('order', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/report')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'groups[]': ['id', 'dateTime'],
        'metrics[]': ['clicks', 'epc'],
        sortField: 'epc',
        sortOrder: 'desc',
      })
    // .expect(200)

    console.log(body)

    expect(body).toEqual([
      {
        clicks: '1',
        dateTime: '2025-11-29 18:24:20',
        epc: null,
        id: 'jqQwfQorLrTG',
      },
    ])
  })
})
