import { INestApplication } from '@nestjs/common'
import { createAuthUser } from '../utils/helpers'
import { truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import {
  CampaignBuilder,
  CampaignBuilderResult,
} from '../utils/entity-builder/campaign-builder'
import { createClicksBuilder } from '../utils/entity-builder/clicks-builder'
import { PrismaService } from '../../src/infra/prisma/prisma.service'
import { ReportRequestBuilder } from '../utils/click-builders/report-request-builder'
import { ReportRangeEnum } from '../../src/domain/report/types'

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
    jest.useRealTimers()
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
      .add((click) => click.createdAt(new Date('2025-02-14 10:29:00+03')))
      .add((click) => click.createdAt(new Date('2025-02-14 10:30:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-14 10:31:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-14 10:32:00+03')))
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

  it('Today', async () => {
    jest.useFakeTimers({
      now: new Date('2025-02-14 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2025-02-13 10:29:00+03')))
      .add((click) => click.createdAt(new Date('2025-02-14 00:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-14 23:59:59+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-15 00:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.today)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2025-02-14 00:00:00' },
      { clicks: '1', dateTime: '2025-02-14 23:59:59' },
    ])
  })

  it('Yesterday', async () => {
    jest.useFakeTimers({
      now: new Date('2025-02-15 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2025-02-13 10:29:00+03')))
      .add((click) => click.createdAt(new Date('2025-02-14 00:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-14 23:59:59+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-02-15 00:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.yesterday)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2025-02-14 00:00:00' },
      { clicks: '1', dateTime: '2025-02-14 23:59:59' },
    ])
  })

  it('CurrentWeek', async () => {
    jest.useFakeTimers({
      now: new Date('2026-01-15 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2026-01-09 10:29:00+03')))
      .add((click) => click.createdAt(new Date('2026-01-12 00:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2026-01-14 23:59:59+03'))) // inc
      .add((click) => click.createdAt(new Date('2026-01-19 00:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.currentWeek)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2026-01-12 00:00:00' },
      { clicks: '1', dateTime: '2026-01-14 23:59:59' },
    ])
  })

  it('last7Days', async () => {
    jest.useFakeTimers({
      now: new Date('2026-01-15 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2026-01-08 09:59:59+03')))
      .add((click) => click.createdAt(new Date('2026-01-08 10:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2026-01-10 10:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2026-01-16 10:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.last7Days)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2026-01-08 10:00:00' },
      { clicks: '1', dateTime: '2026-01-10 10:00:00' },
    ])
  })

  it('currentMonth', async () => {
    jest.useFakeTimers({
      now: new Date('2026-02-15 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2026-01-31 23:59:59+03')))
      .add((click) => click.createdAt(new Date('2026-02-08 10:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2026-02-10 10:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2026-03-01 00:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.currentMonth)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2026-02-08 10:00:00' },
      { clicks: '1', dateTime: '2026-02-10 10:00:00' },
    ])
  })

  it('previousMonth', async () => {
    jest.useFakeTimers({
      now: new Date('2025-04-15 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2025-02-28 23:59:59+03')))
      .add((click) => click.createdAt(new Date('2025-03-01 00:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-03-10 10:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-04-01 00:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.previousMonth)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2025-03-01 00:00:00' },
      { clicks: '1', dateTime: '2025-03-10 10:00:00' },
    ])
  })

  it('last30Days', async () => {
    jest.useFakeTimers({
      now: new Date('2025-06-15 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2025-05-16 09:59:59+03')))
      .add((click) => click.createdAt(new Date('2025-05-16 10:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-06-15 10:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-06-15 10:00:01+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.last30Days)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2025-05-16 10:00:00' },
      { clicks: '1', dateTime: '2025-06-15 10:00:00' },
    ])
  })

  it('currentYear', async () => {
    jest.useFakeTimers({
      now: new Date('2025-06-15 10:00:00+03'),
      doNotFake: ['nextTick', 'setImmediate'],
    })

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2024-12-31 23:59:59+03')))
      .add((click) => click.createdAt(new Date('2025-01-01 00:00:00+03'))) // inc
      .add((click) => click.createdAt(new Date('2025-12-31 23:59:59+03'))) // inc
      .add((click) => click.createdAt(new Date('2026-01-01 00:00:00+03')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .timezone('+03:00')
      .range(ReportRangeEnum.currentYear)
      .metrics(['clicks'])
      .groups(['dateTime'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toStrictEqual([
      { clicks: '1', dateTime: '2025-01-01 00:00:00' },
      { clicks: '1', dateTime: '2025-12-31 23:59:59' },
    ])
  })
})
