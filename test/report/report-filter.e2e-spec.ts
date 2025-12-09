import { INestApplication } from '@nestjs/common'
import { createAuthUser } from '../utils/helpers'
import { truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { createClicksBuilder } from '../utils/entity-builder/clicks-builder'
import { ReportRequestBuilder } from '../utils/click-builders/report-request-builder'
import { createClickBuilder } from '../utils/entity-builder/click-builder'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { FilterOperatorEnum as Op } from '@/domain/report/types'

describe('Report Filter (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let prisma: PrismaService
  let campaignId: string

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

    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)
    campaignId = campaign.id
  })

  it('formula', async () => {
    await createClicksBuilder()
      .campaignId(campaignId)
      .add((click) => click.isBot(false).isProxy(true))
      .add((click) => click.isBot(false).isProxy(true))
      .add((click) => click.isBot(true).isProxy(true))
      .add((click) => click.isBot(true).isProxy(false))
      .add((click) => click.isBot(false).isProxy(false))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .groups(['isProxy'])
      .metrics(['bots_pct'])
      .addFilter('bots_pct', Op['>'], 40)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ isProxy: false, bots_pct: '50' }])
  })

  it('identifier', async () => {
    await createClicksBuilder()
      .campaignId(campaignId)
      .add((click) => click.isBot(false).isProxy(true))
      .add((click) => click.isBot(false).isProxy(true))
      .add((click) => click.isBot(true).isProxy(true))
      .add((click) => click.isBot(true).isProxy(false))
      .add((click) => click.isBot(false).isProxy(false))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .groups(['isProxy'])
      .metrics(['clicks'])
      .addFilter('clicks', Op['='], 2)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ isProxy: false, clicks: '2' }])
  })

  it.each([
    ['dateTime', '2024-06-23 08:30:22'],
    ['year', 2023],
    ['month', '2024-06'],
    ['week', 25],
    ['weekday', 3],
    ['day', '2023-07-26'],
    ['hour', 9],
    ['dayHour', '2023-07-26 09:00'],
  ])('date %s', async (field, value) => {
    await createClicksBuilder()
      .campaignId(campaignId)
      .add((click) => click.createdAt(new Date('2024-06-23 08:30:22')))
      .add((click) => click.createdAt(new Date('2023-07-26 09:40:33')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter(field, Op['='], value)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ clicks: '1' }])
  })

  it('campaignId', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    await createClickBuilder().campaignId(campaignId).save(prisma)
    await createClickBuilder().campaignId(campaign.id).save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('campaignId', Op['='], campaignId)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ clicks: '1' }])
  })

  it('emptyReferer', async () => {
    await createClickBuilder({ referer: 'Ref1' })
      .campaignId(campaignId)
      .save(prisma)
    await createClickBuilder().campaignId(campaignId).save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('emptyReferer', Op['='], true)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ clicks: '1' }])
  })

  it('ip2', async () => {
    await createClickBuilder({ ip: '1.2.3.4' })
      .campaignId(campaignId)
      .save(prisma)
    await createClickBuilder({ ip: '4.3.2.1' })
      .campaignId(campaignId)
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('ip2', Op['='], '4.3')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ clicks: '1' }])
  })

  it('ip3', async () => {
    await createClickBuilder({ ip: '1.2.3.4' })
      .campaignId(campaignId)
      .save(prisma)
    await createClickBuilder({ ip: '4.3.2.1' })
      .campaignId(campaignId)
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('ip3', Op['='], '4.3.2')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ clicks: '1' }])
  })

  it.each([
    ['country', 'US', 'GB'],
    ['offerId', faker.string.uuid(), faker.string.uuid()],
    ['isProxy', true, false],
    ['destination', 'value 1', 'value 2'],
    ['ip', '192.168.1.3', '192.168.2.3'],
  ])('field %s', async (field, value1, value2) => {
    await createClickBuilder({ [field]: value1 })
      .campaignId(campaignId)
      .save(prisma)

    await createClickBuilder({ [field]: value2 })
      .campaignId(campaignId)
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter(field, Op['='], value2)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ clicks: '1' }])
  })
})
