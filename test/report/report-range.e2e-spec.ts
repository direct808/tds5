import { INestApplication } from '@nestjs/common'
import { createAuthUser } from '../utils/helpers'
import { truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import {
  CampaignBuilder,
  CampaignBuilderResult,
} from '../utils/entity-builder/campaign-builder'
import { createClicksBuilder } from '../utils/entity-builder/clicks-builder'
import { faker } from '@faker-js/faker'
import { createClickBuilder } from '../utils/entity-builder/click-builder'
import { SourceBuilder } from '../utils/entity-builder/source-builder'
import { OfferBuilder } from '../utils/entity-builder/offer-builder'
import { AffiliateNetworkBuilder } from '../utils/entity-builder/affiliate-network-builder'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { ClickUncheckedCreateInput } from '@generated/prisma/models/Click'
import { ReportRequestBuilder } from '../utils/click-builders/report-request-builder'
import { FilterOperatorEnum, ReportRangeEnum } from '@/domain/report/types'

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

  it('Range', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2025-02-13 21:00:00+00')))
      .add((click) => click.createdAt(new Date('2025-02-15 21:00:00+00')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.custom_date_range, '2025-02-14', '2025-02-15')
      .metrics(['clicks'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([{ clicks: '1' }])
  })
})
