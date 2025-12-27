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
import { FilterOperatorEnum } from '@/domain/report/types'

describe('Report (e2e)', () => {
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

  it('Metric count conversions', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add()
      .add((click) =>
        click
          .cost(4)
          .addConv((c) => c.tid('1').status('sale'))
          .addConv((c) => c.tid('2').status('lead'))
          .addConv((c) => c.tid('3').status('registration'))
          .addConv((c) => c.tid('4').status('rejected'))
          .addConv((c) => c.tid('5').status('trash'))
          .addConv((c) => c.tid('6').status('deposit')),
      )
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics([
        'clicks',
        'conversions',
        'conversions_sale',
        'conversions_lead',
        'conversions_registration',
        'conversions_rejected',
        'conversions_trash',
        'conversions_deposit',
      ])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        clicks: '2',
        conversions: '4',
        conversions_sale: '1',
        conversions_lead: '1',
        conversions_registration: '1',
        conversions_rejected: '1',
        conversions_trash: '1',
        conversions_deposit: '1',
      },
    ])
  })

  it('Metric revenue', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) =>
        click
          .addConv((c) => c.tid('1').revenue(3.1233).status('sale'))
          .addConv((c) => c.tid('2').revenue(2.643).status('lead')),
      )
      .add((click) =>
        click
          .cost(4)
          .addConv((c) => c.tid('1').revenue(1.1).status('sale'))
          .addConv((c) => c.tid('2').revenue(2.2).status('lead'))
          .addConv((c) => c.tid('3').revenue(3.3).status('registration'))
          .addConv((c) => c.tid('4').revenue(4.432).status('rejected'))
          .addConv((c) => c.tid('5').revenue(5.1234).status('trash'))
          .addConv((c) => c.tid('6').revenue(6.31232).status('deposit')),
      )
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics([
        'revenue',
        'revenue_sale',
        'revenue_lead',
        'revenue_registration',
        'revenue_rejected',
        'revenue_trash',
        'revenue_deposit',
      ])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        revenue: '18.67',
        revenue_sale: '4.22',
        revenue_lead: '4.84',
        revenue_deposit: '6.31',
        revenue_registration: '3.30',
        revenue_rejected: '4.43',
        revenue_trash: '5.12',
      },
    ])
  })

  it('roi', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) =>
        click
          .cost(1.33)
          .addConv((c) => c.tid('1').revenue(3.1233).status('sale'))
          .addConv((c) => c.tid('2').revenue(4.56).status('lead'))
          .addConv((c) => c.tid('3').revenue(2.643).status('lead')),
      )
      .add((click) =>
        click
          .cost(4.7)
          .addConv((c) => c.tid('1').revenue(1.1).status('sale'))
          .addConv((c) => c.tid('2').revenue(2.2).status('lead'))
          .addConv((c) => c.tid('3').revenue(3.3).status('registration'))
          .addConv((c) => c.tid('4').revenue(4.432).status('rejected'))
          .addConv((c) => c.tid('5').revenue(5.1234).status('trash'))
          .addConv((c) => c.tid('6').revenue(6.31232).status('deposit')),
      )
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics([
        'revenue',
        'cost',
        'roi',
        'roi_confirmed',
        'profit_loss',
        'profit_loss_confirmed',
        'approve_pct',
      ])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        cost: '6.03',
        revenue: '23.23',
        roi: '285.24',
        roi_confirmed: '74.63',
        profit_loss: '3.85',
        profit_loss_confirmed: '1.75',
        approve_pct: '75',
      },
    ])
  })

  it('clicks', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.isUniqueGlobal(true))
      .add((click) => click.isUniqueGlobal(true))
      .add((click) => click.isUniqueGlobal(true))
      .add((click) => click.isUniqueCampaign(true))
      .add((click) => click.isUniqueCampaign(true))
      .add((click) => click.isUniqueStream(true))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics([
        'clicks',
        'clicks_unique_global',
        'clicks_unique_campaign',
        'clicks_unique_stream',
        'clicks_unique_global_pct',
        'clicks_unique_campaign_pct',
        'clicks_unique_stream_pct',
      ])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        clicks: '6',
        clicks_unique_global: '3',
        clicks_unique_campaign: '2',
        clicks_unique_stream: '1',
        clicks_unique_global_pct: '50',
        clicks_unique_campaign_pct: '33',
        clicks_unique_stream_pct: '17',
      },
    ])
  })

  it('bots, proxies', async () => {
    const clicks = [
      [false, false, null],
      [null, true, null],
      [true, true, null],
      [true, null, null],
      [true, false, 'referer'],
    ] as const

    const builder = createClicksBuilder()

    for (const [isBot, isProxy, referer] of clicks) {
      builder
        .campaignId(campaign.id)
        .add((click) => click.isBot(isBot).isProxy(isProxy).referer(referer))
    }

    await builder.save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics(['clicks', 'bots', 'bots_pct', 'proxies', 'empty_referer'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        clicks: '5',
        bots: '3',
        bots_pct: '60',
        proxies: '2',
        empty_referer: '4',
      },
    ])
  })

  it('cr', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add()
      .add((click) => click.addConv((c) => c.status('lead')))
      .add((click) => click.addConv((c) => c.status('lead')))
      .add((click) => click.addConv((c) => c.status('lead')))
      .add((click) => click.addConv((c) => c.status('lead')))
      .add((click) => click.addConv((c) => c.status('sale')))
      .add((click) => click.addConv((c) => c.status('sale')))
      .add((click) => click.addConv((c) => c.status('sale')))
      .add((click) => click.addConv((c) => c.status('deposit')))
      .add((click) => click.addConv((c) => c.status('deposit')))
      .add((click) => click.addConv((c) => c.status('registration')))
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics([
        'cr',
        'cr_sale',
        'cr_deposit',
        'cr_hold',
        'cr_registration',
        'cr_regs_to_deps',
      ])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        cr: '90.91',
        cr_deposit: '18.18',
        cr_hold: '36.36',
        cr_registration: '9.09',
        cr_regs_to_deps: '50.00',
        cr_sale: '27.27',
      },
    ])
  })

  it('epc, cp', async () => {
    const data = [
      [true, 1.1, 'lead', 1.2],
      [true, 2.1, 'registration', 2.2],
      [true, 3.1, 'sale', 3.2],
      [false, 4.1, 'deposit', 4.2],
      [false, 5.1, 'trash', 5.2],
      [false, 6.1, 'rejected', 6.2],
    ] as const

    const builder = createClicksBuilder().campaignId(campaign.id).add()

    data.forEach(([isGlobal, revenue, staus, cost]) => {
      builder.add((click) =>
        click
          .isUniqueGlobal(isGlobal)
          .cost(cost)
          .addConv((c) => c.revenue(revenue).status(staus)),
      )
    })

    await builder.save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics([
        'epc',
        'uepc',
        'epc_confirmed',
        'uepc_confirmed',
        'epc_hold',
        'uepc_hold',

        'cps',
        'cpl',
        'cpr',
        'cpd',
        'cpa',
        'cpc',
        'ucpc',
        'ecpc',
        'ecpm',
        'ecpm_confirmed',
        'ucr',
      ])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        epc: '1.49',
        epc_confirmed: '1.03',
        epc_hold: '0.46',
        uepc: '3.47',
        uepc_confirmed: '2.40',
        uepc_hold: '1.07',

        cps: '22.20',
        cpl: '22.20',
        cpr: '22.20',
        cpd: '22.20',
        cpa: '7.40',
        cpc: '3.17',
        ucpc: '7.40',
        ecpc: '3171.43',
        ecpm: '1485.71',
        ecpm_confirmed: '1028.57',
        ucr: '33.33',
      },
    ])
  })

  it('group', async () => {
    const source = await SourceBuilder.create()
      .name('Source')
      .userId(userId)
      .save(prisma)

    const offer = await OfferBuilder.create()
      .name('Offer')
      .url(faker.internet.url())
      .userId(userId)
      .save(prisma)

    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Affiliate Network')
      .userId(userId)
      .save(prisma)

    const clickData: Partial<ClickUncheckedCreateInput> = {
      createdAt: new Date('2015-10-20 21:22:34'),
      id: 'id',
      country: 'China',
      city: 'City',
      region: 'Region',
      adCampaignId: 'AdCampaign Id',
      campaignId: campaign.id,
      previousCampaignId: faker.string.uuid(),
      offerId: offer.id,
      affiliateNetworkId: affiliateNetwork.id,
      sourceId: source.id,
      streamId: campaign.streams[0]!.id,
      destination: 'Destination',
      referer: 'Referer',
      keyword: 'Keyword',
      externalId: 'External Id',
      creativeId: 'Creative Id',
      language: 'EN',
      isBot: true,

      deviceType: 'Device type',
      deviceModel: 'Device Model',
      userAgent: 'User Agent',
      os: 'Os',
      osVersion: 'Os Version',
      browser: 'Browser',
      browserVersion: 'Browser Version',
      ip: '192.168.50.90',
      isProxy: true,
      subId1: 'sub Id 1',
      subId2: 'sub Id 2',
      isUniqueGlobal: true,
      isUniqueCampaign: false,
      isUniqueStream: true,
    }

    const click = await createClickBuilder(clickData)
      .campaignId(campaign.id)
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics(['clicks'])
      .groups([
        'id',
        'country',
        'city',
        'region',
        'adCampaignId',
        'campaignId',
        'previousCampaignId',
        'offerId',
        'affiliateNetworkId',
        'sourceId',
        'streamId',
        'dateTime',
        'year',
        'month',
        'week',
        'weekday',
        'day',
        'hour',
        'dayHour',
        'source',
        'campaign',
        'stream',
        'offer',
        'affiliateNetwork',
        'destination',
        'emptyReferer',
        'referer',
        'keyword',
        'visitorId',
        'externalId',
        'creativeId',
        'language',
        'isBot',
        'deviceType',
        'deviceModel',
        'userAgent',
        'os',
        'osVersion',
        'browser',
        'browserVersion',
        'ip',
        'isProxy',
        'subId1',
        'subId2',
        'ip2',
        'ip3',
        'isUniqueGlobal',
        'isUniqueCampaign',
        'isUniqueStream',
      ])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([
      {
        clicks: '1',
        id: click.id,
        country: 'China',
        city: 'City',
        region: 'Region',
        adCampaignId: 'AdCampaign Id',
        campaignId: campaign.id,
        previousCampaignId: click.previousCampaignId,
        offerId: click.offerId,
        affiliateNetworkId: click.affiliateNetworkId,
        sourceId: click.sourceId,
        streamId: click.streamId,
        dateTime: '2015-10-20 21:22:34',
        year: 2015,
        month: '2015-10',
        week: 43,
        weekday: 2,
        day: '2015-10-20',
        hour: 21,
        dayHour: '2015-10-20 21:00',
        source: source.name,
        campaign: campaign.name,
        offer: offer.name,
        stream: campaign.streams[0]!.name,
        affiliateNetwork: affiliateNetwork.name,
        destination: 'Destination',
        emptyReferer: false,
        referer: 'Referer',
        keyword: 'Keyword',
        visitorId: click.visitorId,
        externalId: 'External Id',
        creativeId: 'Creative Id',
        language: 'EN',
        isBot: true,
        deviceType: 'Device type',
        deviceModel: 'Device Model',
        userAgent: 'User Agent',
        os: 'Os',
        osVersion: 'Os Version',
        browser: 'Browser',
        browserVersion: 'Browser Version',
        ip: click.ip,
        isProxy: true,
        subId1: 'sub Id 1',
        subId2: 'sub Id 2',
        ip2: '192.168',
        ip3: '192.168.50',
        isUniqueGlobal: true,
        isUniqueCampaign: false,
        isUniqueStream: true,
      },
    ])
  })

  it('order', async () => {
    // Arrange
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2027-06-07')))
      .add((click) => click.createdAt(new Date('2023-06-07')))
      .add((click) => click.createdAt(new Date('2025-06-07')))
      .save(prisma)

    // Act
    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .groups(['year'])
      .metrics(['clicks'])
      .sort('year', 'asc')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const result = body.rows.map((item: any) => item.year)

    // Assert
    expect(result).toEqual([2023, 2025, 2027])
  })

  it('pagination', async () => {
    // Arrange
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.createdAt(new Date('2027-06-07')))
      .add((click) => click.createdAt(new Date('2023-06-07')))
      .add((click) => click.createdAt(new Date('2025-06-07')))
      .save(prisma)

    // Act
    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 2)
      .groups(['year'])
      .metrics(['clicks'])
      .sort('year', 'asc')
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    // Assert
    expect(body.rows).toHaveLength(2)
    expect(body.total).toBe(3)
  })

  it('Filter with summary', async () => {
    // Arrange
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.country('ch'))
      .add((click) => click.country('ch'))
      .add((click) => click.country('be'))
      .add((click) => click.country('be'))
      .add((click) => click.country('ca'))
      .save(prisma)

    // Act
    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .groups(['country'])
      .metrics(['clicks'])
      .addFilter('clicks', FilterOperatorEnum['>'], 1)
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    // console.log(body)
    // Assert
    expect(body).toBe({
      rows: [
        { clicks: '2', country: 'be' },
        { clicks: '2', country: 'ch' },
      ],
      summary: { clicks: '4' },
      total: 2,
    })
  })

  it('Check if one operand is null result must be not null', async () => {
    // sum(...) + sum(...) << null
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) =>
        click.cost(1.33).addConv((c) => c.revenue(3.1233).status('sale')),
      )
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 25)
      .metrics(['roi'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(body.rows).toEqual([{ roi: '134.59' }])
  })

  it('summary', async () => {
    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) =>
        click
          .cost(100)
          .country('ch')
          .addConv((c) => c.revenue(300).status('sale')),
      )
      .add((click) =>
        click
          .cost(44)
          .country('ch')
          .addConv((c) => c.revenue(55).status('sale')),
      )
      .add((click) =>
        click
          .cost(22)
          .country('be')
          .addConv((c) => c.revenue(77).status('sale')),
      )
      .add((click) =>
        click
          .cost(54)
          .country('ge')
          .addConv((c) => c.revenue(125).status('sale')),
      )
      .save(prisma)

    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 2)
      .groups(['country'])
      .metrics(['revenue', 'cost', 'roi'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    // console.log(body)

    expect(body).toEqual({
      total: 4,
      summary: { revenue: '557.00', cost: '220.00', roi: '153.18' },
      rows: [
        {
          cost: '22.00',
          country: 'be',
          revenue: '77.00',
          roi: '250.00',
        },
        {
          cost: '144.00',
          country: 'ch',
          revenue: '355.00',
          roi: '146.53',
        },
      ],
    })
  })

  it('summary witch empty result', async () => {
    const { body } = await ReportRequestBuilder.create(app)
      .pagination(0, 2)
      .groups(['country'])
      .metrics(['revenue', 'cost', 'roi'])
      .request()
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    // console.log(body)

    expect(body).toEqual({
      total: 0,
      summary: { revenue: '0.00', cost: '0.00', roi: '0.00' },
      rows: [],
    })
  })
})
