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
          'revenue',
          'revenue_sale',
          'revenue_lead',
          'revenue_registration',
          'revenue_rejected',
          'revenue_trash',
          'revenue_deposit',
        ],
      })
      .expect(200)

    expect(body).toEqual([
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
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) =>
        click
          .cost(1.33)
          .addConv((c) => c.revenue(3.1233).status('sale'))
          .addConv((c) => c.revenue(2.643).status('lead')),
      )
      .add((click) =>
        click
          .cost(4.7)
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
          'revenue',
          'cost',
          'roi',
          'roi_confirmed',
          'profit_loss',
          'profit_loss_confirmed',
          // 'revenue_sale',
          // 'revenue_deposit',
        ],
      })
      .expect(200)

    expect(body).toEqual([
      {
        cost: '6.03',
        revenue: '18.67',
        roi: '209.6185737976782800',
        roi_confirmed: '74.62686567164179104500',
        profit_loss: '3.0961857379767828',
        profit_loss_confirmed: '1.7462686567164179',
      },
    ])
  })

  it('clicks', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    await createClicksBuilder()
      .campaignId(campaign.id)
      .add((click) => click.cost(1.33))
      .add((click) => click.cost(4.7))
      .save(dataSource)

    const { body } = await request(app.getHttpServer())
      .get('/report')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': [
          'clicks',
          'clicks_unique_global',
          'clicks_unique_campaign',
          'clicks_unique_stream',
          'clicks_unique_global_pct',
          'clicks_unique_campaign_pct',
          'clicks_unique_stream_pct',
        ],
      })
      .expect(200)

    expect(body).toEqual([
      {
        clicks: '2',
        clicks_unique_global: '2',
        clicks_unique_campaign: '2',
        clicks_unique_stream: '2',
        clicks_unique_global_pct: '100',
        clicks_unique_campaign_pct: '100',
        clicks_unique_stream_pct: '100',
      },
    ])
  })
})
