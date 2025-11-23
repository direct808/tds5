import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { createAuthUser } from '../utils/helpers'
import { truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { createClicksBuilder } from '../utils/entity-builder/clicks-builder'
import { ReportService } from '@/domain/report/report.service'

describe('Report Order (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let dataSource: DataSource
  let metrics: string[]

  afterEach(async () => {
    await app.close()
  })

  beforeAll(async () => {
    await truncateTables()
    app = await createApp()
    dataSource = app.get(DataSource)
    const authData = await createAuthUser(app)
    accessToken = authData.accessToken
    userId = authData.user.id

    const service = app.get(ReportService)
    metrics = service.getAllMetricsFieldNames()

    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    await createClicksBuilder().campaignId(campaign.id).add().save(dataSource)
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

    expect(body).toEqual([{ clicks: '7', cpa: '7.40' }])
  })
})
