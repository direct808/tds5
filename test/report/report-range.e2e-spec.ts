import { INestApplication } from '@nestjs/common'
import { createAuthUser } from '../utils/helpers'
import { truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import {
  CampaignBuilder,
  CampaignBuilderResult,
} from '../utils/entity-builder/campaign-builder'
import { createClicksBuilder } from '../utils/entity-builder/clicks-builder'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { ReportRequestBuilder } from '../utils/click-builders/report-request-builder'
import { ReportRangeEnum } from '@/domain/report/types'

describe('Report-range (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let prisma: PrismaService
  let campaign: CampaignBuilderResult

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
    campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)
  })

  it('Date range', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2025-02-13 23:59:59+03')))
      .add((click) => click.createdAt(new Date('2025-02-14 00:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-15 23:59:59+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-16 00:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.customDateRange, '2025-02-14', '2025-02-15')
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2025-02-14 00:00:00' },
      { clicks: '1', dateTime: '2025-02-15 23:59:59' },
    ])
  })

  it('Time range', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2025-02-14 10:29:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-14 10:30:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-14 10:31:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-14 10:32:00+03'))) // inc
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(
        ReportRangeEnum.customTimeRange,
        '2025-02-14 10:30:00',
        '2025-02-14 10:31:00',
      )
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2025-02-14 10:30:00' },
      { clicks: '1', dateTime: '2025-02-14 10:31:00' },
    ])
  })
})
