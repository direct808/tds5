import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { createAuthUser } from '../utils/helpers'
import { truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import './click'
import { createClicksBuilder } from '../utils/entity-builder/clicks-builder'

describe('Report (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let dataSource: DataSource

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await truncateTables()
    app = await createApp()
    dataSource = app.get(DataSource)
    const authData = await createAuthUser(app)
    accessToken = authData.accessToken
    userId = authData.user.id
  })

  it('Metric count conversions', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add()
      .add((click) =>
        click
          .cost(4)
          .addConv((c) => c.status('sale'))
          .addConv((c) => c.status('lead'))
          .addConv((c) => c.status('registration'))
          .addConv((c) => c.status('rejected'))
          .addConv((c) => c.status('trash'))
          .addConv((c) => c.status('deposit')),
      )
      .save(dataSource)

    const { body } = await request(app.getHttpServer())
      .get('/report')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': [
          'clicks',
          'conversions',
          'conversions_sale',
          'conversions_lead',
          'conversions_registration',
          'conversions_rejected',
          'conversions_trash',
          'conversions_deposit',
        ],
      })
      .expect(200)

    expect(body).toEqual([
      {
        clicks: 2,
        conversions: 4,
        conversions_sale: 1,
        conversions_lead: 1,
        conversions_registration: 1,
        conversions_rejected: 1,
        conversions_trash: 1,
        conversions_deposit: 1,
      },
    ])
  })

  it('Metric revenue', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) =>
        click
          .addConv((c) => c.revenue(3.1233).status('sale'))
          .addConv((c) => c.revenue(2.643).status('lead')),
      )
      .add((click) =>
        click
          .cost(4)
          .addConv((c) => c.revenue(1.1).status('sale'))
          .addConv((c) => c.revenue(2.2).status('lead'))
          .addConv((c) => c.revenue(3.3).status('registration'))
          .addConv((c) => c.revenue(4.432).status('rejected'))
          .addConv((c) => c.revenue(5.1234).status('trash'))
          .addConv((c) => c.revenue(6.31232).status('deposit')),
      )
      .save(dataSource)

    const { body } = await request(app.getHttpServer())
      .get('/report')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': [
          'revenue_sale',
          'revenue_lead',
          'revenue_registration',
          'revenue_rejected',
          'revenue_trash',
          'revenue_deposit',
        ],
      })
      .expect(200)

    console.log(body)

    expect(body).toEqual([
      {
        revenue_sale: 4.2233,
        revenue_lead: 4.843,
        revenue_deposit: 6.31,
        revenue_registration: 3,
        revenue_rejected: 4,
        revenue_trash: 5,
      },
    ])
  })

  it('getReport', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    // await createClicks(dataSource, campaign.id)
    // const click = await ClickBuilder.create({
    //   id: '234234',
    //   visitorId: '123123',
    //   campaignId: campaign.id,
    //   cost: 123,
    // }).save(dataSource)
    //
    // await ConversionBuilder.create({
    //   clickId: click.id,
    //   status: 'sale',
    // }).save(dataSource)
    //
    // await ConversionBuilder.create({
    //   clickId: click.id,
    //   status: 'registration',
    // }).save(dataSource)
    //
    // await ConversionBuilder.create({
    //   clickId: click.id,
    //   status: 'salse',
    // }).save(dataSource)

    const { body } = await request(app.getHttpServer())
      .get('/report')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': [
          'clicks',
          'conversions',
          'cost',
          'conversions_sale',
          'conversions_lead',
          'conversions_registration',
        ],
      })
      .expect(200)

    console.log(body)
    expect(body).toEqual([
      {
        clicks: 1,
        conversions: 3,
        cost: 4,
        conversions_sale: 1,
        conversions_lead: 2,
        conversions_registration: 0,
      },
    ])
  })
})
