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

  it('Unknown filter field', async () => {
    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('unknown_field', '>', 40)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Unknown filter: unknown_field',
      statusCode: 400,
    })
  })

  it('Group filter null', async () => {
    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('source', '=', 'source1')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Unknown filter: source',
      statusCode: 400,
    })
  })

  it('Invalid bool value', async () => {
    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('isUniqueGlobal', '=', 'Invalid value ')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Invalid value for: isUniqueGlobal',
      statusCode: 400,
    })
  })

  it('Invalid numeric value', async () => {
    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('week', '=', 'Invalid value')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Invalid value for: week',
      statusCode: 400,
    })
  })

  it('Invalid string value', async () => {
    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('adCampaignId', '=', true)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(400)

    expect(body).toEqual({
      error: 'Bad Request',
      message: 'Invalid value for: adCampaignId',
      statusCode: 400,
    })
  })

  it('Invalid ip value', async () => {
    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      .addFilter('ip', '=', 'Bad ip')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(400)

    // console.log(body)

    // expect(body).toEqual({
    //   error: 'Bad Request',
    //   message: 'Invalid value for: ip',
    //   statusCode: 400,
    // })
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
      .addFilter('bots_pct', '>', 40)
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
      .addFilter('clicks', '=', 2)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    // console.log(body)

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
      // .groups([field])
      .addFilter(field, '=', value)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
    // console.log(body)

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
      // .groups(['campaignId'])
      .addFilter('campaignId', '=', campaignId)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
    // console.log(body)

    expect(body).toEqual([{ clicks: '1' }])
  })

  it('emptyReferer', async () => {
    await createClickBuilder({ referer: 'Ref1' })
      .campaignId(campaignId)
      .save(prisma)
    await createClickBuilder().campaignId(campaignId).save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      // .groups(['campaignId'])
      .addFilter('emptyReferer', '=', true)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
    // console.log(body)

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
      .addFilter('ip2', '=', '4.3')
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
      .addFilter('ip3', '=', '4.3.2')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body).toEqual([{ clicks: '1' }])
  })

  // todo id, visitorId

  it.each([
    ['country', 'US', 'GB'],
    ['city', 'city1', 'city2'],
    ['region', 'region1', 'region2'],
    ['adCampaignId', 'value 1', 'value 2'],
    ['previousCampaignId', faker.string.uuid(), faker.string.uuid()],
    ['offerId', faker.string.uuid(), faker.string.uuid()],
    ['affiliateNetworkId', faker.string.uuid(), faker.string.uuid()],
    ['sourceId', faker.string.uuid(), faker.string.uuid()],
    ['streamId', faker.string.uuid(), faker.string.uuid()],
    ['isUniqueGlobal', true, false],
    ['isUniqueCampaign', true, false],
    ['isUniqueStream', true, false],
    ['isBot', true, false],
    ['isProxy', true, false],
    ['destination', 'value 1', 'value 2'],
    ['referer', 'value 1', 'value 2'],
    ['keyword', 'value 1', 'value 2'],
    ['externalId', 'value 1', 'value 2'],
    ['creativeId', 'value 1', 'value 2'],
    ['language', 'en', 'ch'],
    ['deviceType', 'value 1', 'value 2'],
    ['deviceModel', 'value 1', 'value 2'],
    ['userAgent', 'value 1', 'value 2'],
    ['os', 'value 1', 'value 2'],
    ['osVersion', 'value 1', 'value 2'],
    ['browser', 'value 1', 'value 2'],
    ['browserVersion', 'value 1', 'value 2'],
    ['ip', '192.168.1.3', '192.168.2.3'],
    ['subId1', 'value 1', 'value 2'],
    ['subId2', 'value 1', 'value 2'],
  ])('field %s', async (field, value1, value2) => {
    await createClickBuilder({ [field]: value1 })
      .campaignId(campaignId)
      .save(prisma)

    await createClickBuilder({ [field]: value2 })
      .campaignId(campaignId)
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .metrics(['clicks'])
      // .groups([field])
      .addFilter(field, '=', value2)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)
    // console.log(body)

    expect(body).toEqual([{ clicks: '1' }])
  })

  describe('String value', () => {
    it.each([
      ['=', 'value1', 'value1', 'value2', 200],
      ['<>', 'value1', 'value1', 'value2', 200],
      ['>', 'value1', 'value1', 'value2', 400],
      ['<', 'value1', 'value1', 'value2', 400],
      ['in', ['value1'], 'value1', 'value2', 200],
      ['not_in', ['value1'], 'value1', 'value2', 200],
      ['contains', 'lue1_', 'value1_', 'value_b', 200],
      ['not_contains', 'lue1_', 'value1_', 'value_b', 200],
      ['starts_with', 'value1', 'value1_', 'value_b', 200],
      ['ends_with', 'ue_b', 'value1_', 'value_b', 200],
      ['regex', 'v[ab]lue\\d', 'value1_', 'value_b', 200],
      ['not_regex', 'v[ab]lue\\d', 'value1_', 'value_b', 200],
      ['between', ['a', 'b'], 'value1_', 'value_b', 400],
    ])(`operator %s`, async (operator, filterValue, value1, value2, status) => {
      await createClicksBuilder()
        .campaignId(campaignId)
        .add((click) => click.destination(value1))
        .add((click) => click.destination(value2))
        .save(prisma)

      const { body } = await ReportRequestBuilder.create(app)
        .metrics(['clicks'])
        .addFilter('destination', operator, filterValue)
        .request()
        .auth(accessToken, { type: 'bearer' })
        .expect(status)

      if (status == 200) {
        expect(body).toEqual([{ clicks: '1' }])
      }
    })
  })

  describe('Numeric value', () => {
    it.each([
      ['=', 2025, 200],
      ['<>', 2025, 200],
      ['>', 2024, 200],
      ['<', 2025, 200],
      ['in', [2025], 400],
      ['not_in', [2025], 400],
      ['contains', 2025, 400],
      ['not_contains', 2025, 400],
      ['starts_with', 2025, 400],
      ['ends_with', 2025, 400],
      ['regex', 2025, 400],
      ['not_regex', 2025, 400],
      ['between', [2024, 2025], 200],
    ])(`operator %s`, async (operator, filterValue, status) => {
      await createClicksBuilder()
        .campaignId(campaignId)
        .add((click) => click.createdAt(new Date('2025-12-01')))
        .add((click) => click.createdAt(new Date('2023-12-01')))
        .save(prisma)

      const { body } = await ReportRequestBuilder.create(app)
        .metrics(['clicks'])
        .addFilter('year', operator, filterValue)
        .request()
        .auth(accessToken, { type: 'bearer' })
        .expect(status)

      if (status == 200) {
        expect(body).toEqual([{ clicks: '1' }])
      }
    })
  })

  describe('Boolean value', () => {
    it.each([
      ['=', true, 200],
      ['<>', true, 400],
      ['>', true, 400],
      ['<', true, 400],
      ['in', [true], 400],
      ['not_in', [true], 400],
      ['contains', true, 400],
      ['not_contains', true, 400],
      ['starts_with', true, 400],
      ['ends_with', true, 400],
      ['regex', true, 400],
      ['not_regex', true, 400],
      ['between', [true, false], 400],
    ])(`operator %s`, async (operator, filterValue, status) => {
      await createClicksBuilder()
        .campaignId(campaignId)
        .add((click) => click.isUniqueGlobal(true))
        .add((click) => click.isUniqueGlobal(false))
        .save(prisma)

      const { body } = await ReportRequestBuilder.create(app)
        .metrics(['clicks'])
        .addFilter('isUniqueGlobal', operator, filterValue)
        .request()
        .auth(accessToken, { type: 'bearer' })
        .expect(status)

      if (status == 200) {
        expect(body).toEqual([{ clicks: '1' }])
      }
    })
  })
})
