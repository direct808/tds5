import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource } from 'typeorm'
import { ClickRepository } from '@/click/shared/click.repository'
import { loadUserFixtures, truncateTables } from '../utils/helpers'
import { AppModule } from '@/app.module'
import { configureApp } from '@/utils/configure-app'
import { CampaignBuilder } from '@/utils/entity-builder/campaign-builder'

describe('Click-data (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let clickRepo: ClickRepository
  const redirectUrl = 'https://example.com/'
  const userId = '00000000-0000-4000-8000-000000000001'
  const code = 'abcdif'
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'

  afterEach(async () => {
    await truncateTables(app)
    await app.close()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    configureApp(app)
    await app.init()
    dataSource = app.get(DataSource)
    clickRepo = app.get(ClickRepository)
    await loadUserFixtures(dataSource)
  })

  it('Checks full click data values', async () => {
    const existsVisitorId = 'abc123'
    const res = await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .createSource((source) => {
        source.name('Source 1').userId(userId)
      })
      .addStreamTypeOffers((stream) => {
        stream.name('Stream 1').addOffer((of) => {
          of.percent(100).createOffer((off) => {
            off
              .name('Offer 1')
              .url(redirectUrl)
              .userId(userId)
              .createAffiliateNetwork((an) => {
                an.name('Affiliate network 1').userId(userId)
              })
          })
        })
      })
      .save(dataSource)

    const q = new URLSearchParams()
    q.append('cost', '5.3496876')
    q.append('ad_campaign_id', 'ad Campaign Id')
    q.append('creative_id', 'creative Id')
    q.append('external_id', 'external_id')
    q.append('extra_param_1', 'extraParam1')
    q.append('extra_param_2', 'extraParam2')
    q.append('sub_id_1', 'sub_id_1 value')
    q.append('sub_id_2', 'sub_id_2 value')
    q.append('keyword', 'keyword')
    q.append('source', 'source value')

    const response = await request(app.getHttpServer())
      .get(`/${code}?${q.toString()}`)
      .set({
        'User-Agent': userAgent,
        Referer: 'Referer value',
        'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8,fr;q=0.7',
      })
      .set('Cookie', ['visitorId=' + existsVisitorId])
      .expect(302)

    expect(response.headers.location).toBe(redirectUrl)

    const clicks = await clickRepo.getByCampaignId(res.id)
    const offer = res.streams[0].streamOffers![0].offer!

    expect(clicks.length).toBe(1)

    expect(clicks[0]).toEqual({
      id: clicks[0].id,
      visitorId: existsVisitorId,
      adCampaignId: 'ad Campaign Id',
      affiliateNetworkId: offer.affiliateNetwork!.id,
      browser: 'Chrome',
      browserVersion: '137.0.0.0',
      campaignId: res.id,
      country: null,
      city: null,
      region: null,
      cost: '5.35',
      createdAt: clicks[0].createdAt,
      creativeId: 'creative Id',
      destination: redirectUrl,
      deviceModel: null,
      deviceType: null,
      externalId: 'external_id',
      extraParam1: 'extraParam1',
      extraParam2: 'extraParam2',
      ip: clicks[0].ip,
      isBot: null,
      isProxy: null,
      isUniqueCampaign: null,
      isUniqueGlobal: null,
      isUniqueStream: null,
      keyword: 'keyword',
      language: 'en',
      offerId: offer.id,
      os: 'Windows',
      osVersion: '10',
      previousCampaignId: null,
      referer: 'Referer value',
      source: 'source value',
      streamId: clicks[0].streamId,
      subId1: 'sub_id_1 value',
      subId2: 'sub_id_2 value',
      trafficSourceId: res.sourceId,
      userAgent: userAgent,
    })
  })
})
