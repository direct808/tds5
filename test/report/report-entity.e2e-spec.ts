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
import request from 'supertest'
import { AffiliateNetworkBuilder } from '../utils/entity-builder/affiliate-network-builder'
import { OfferBuilder } from '../utils/entity-builder/offer-builder'
import { SourceBuilder } from '../utils/entity-builder/source-builder'

describe('Report-entity (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let prisma: PrismaService

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
  })

  it('campaign', async () => {
    const [, campaign1, campaign2] = await Promise.all([
      createCampaign(prisma, userId, 'aa'),
      createCampaign(prisma, userId, 'bb'),
      createCampaign(prisma, userId, 'cc'),
      createCampaign(prisma, userId, 'dd'),
    ])

    await createClicksBuilder()
      .campaignId(campaign1.id)
      .add((click) => click.cost(5))
      .save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/campaign')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': ['clicks', 'roi'],
        offset: 1,
        limit: 2,
        timezone: '+03:00',
        rangeInterval: 'today',
        sortField: 'name',
        sortOrder: 'asc',
      })
      .expect(200)

    // console.log(body)

    expect(body).toStrictEqual({
      rows: expect.arrayContaining([
        {
          id: campaign1.id,
          name: campaign1.name,
          clicks: '1',
          roi: '-100',
        },
        {
          id: campaign2.id,
          name: campaign2.name,
          clicks: '0',
          roi: '0',
        },
      ]),
      summary: { clicks: '1', roi: '-100' },
      total: 4,
    })
  })

  it('affiliate-network', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    const [, af1, af2] = await Promise.all([
      AffiliateNetworkBuilder.create().name('aa').userId(userId).save(prisma),
      AffiliateNetworkBuilder.create().name('bb').userId(userId).save(prisma),
      AffiliateNetworkBuilder.create().name('cc').userId(userId).save(prisma),
      AffiliateNetworkBuilder.create().name('dd').userId(userId).save(prisma),
    ])

    await createClicksBuilder()
      .campaignId(campaign.id)
      .affiliateNetworkId(af1.id)
      .add((click) => click.cost(5))
      .save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/affiliate-network')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': ['clicks', 'roi'],
        offset: 1,
        limit: 2,
        timezone: '+03:00',
        rangeInterval: 'today',
        sortField: 'name',
        sortOrder: 'asc',
      })
      .expect(200)

    // console.log(body)

    expect(body).toStrictEqual({
      rows: expect.arrayContaining([
        {
          id: af1.id,
          name: af1.name,
          clicks: '1',
          roi: '-100',
        },
        {
          id: af2.id,
          name: af2.name,
          clicks: '0',
          roi: '0',
        },
      ]),
      summary: { clicks: '1', roi: '-100' },
      total: 4,
    })
  })

  it('offer', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    const [, offer1, offer2] = await Promise.all([
      OfferBuilder.create().name('aa').url('url').userId(userId).save(prisma),
      OfferBuilder.create().name('bb').url('url').userId(userId).save(prisma),
      OfferBuilder.create().name('cc').url('url').userId(userId).save(prisma),
      OfferBuilder.create().name('dd').url('url').userId(userId).save(prisma),
    ])

    await createClicksBuilder()
      .campaignId(campaign.id)
      .offerId(offer1.id)
      .add((click) => click.cost(5))
      .save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/offer')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': ['clicks', 'roi'],
        offset: 1,
        limit: 2,
        timezone: '+03:00',
        rangeInterval: 'today',
        sortField: 'name',
        sortOrder: 'asc',
      })
      .expect(200)

    // console.log(body)

    expect(body).toStrictEqual({
      rows: expect.arrayContaining([
        {
          id: offer1.id,
          name: offer1.name,
          clicks: '1',
          roi: '-100',
        },
        {
          id: offer2.id,
          name: offer2.name,
          clicks: '0',
          roi: '0',
        },
      ]),
      summary: { clicks: '1', roi: '-100' },
      total: 4,
    })
  })

  it('source', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)

    const [, source1, source2] = await Promise.all([
      SourceBuilder.create().name('aa').userId(userId).save(prisma),
      SourceBuilder.create().name('bb').userId(userId).save(prisma),
      SourceBuilder.create().name('cc').userId(userId).save(prisma),
      SourceBuilder.create().name('dd').userId(userId).save(prisma),
    ])

    await createClicksBuilder()
      .campaignId(campaign.id)
      .sourceId(source1.id)
      .add((click) => click.cost(5))
      .save(prisma)

    const { body } = await request(app.getHttpServer())
      .get('/api/source')
      .auth(accessToken, { type: 'bearer' })
      .query({
        'metrics[]': ['clicks', 'roi'],
        offset: 1,
        limit: 2,
        timezone: '+03:00',
        rangeInterval: 'today',
        sortField: 'name',
        sortOrder: 'asc',
      })
      .expect(200)

    // console.log(body)

    expect(body).toStrictEqual({
      rows: expect.arrayContaining([
        {
          id: source1.id,
          name: source1.name,
          clicks: '1',
          roi: '-100',
        },
        {
          id: source2.id,
          name: source2.name,
          clicks: '0',
          roi: '0',
        },
      ]),
      summary: { clicks: '1', roi: '-100' },
      total: 4,
    })
  })
})

function createCampaign(
  prisma: PrismaService,
  userId: string,
  name: string,
): Promise<CampaignBuilderResult> {
  return CampaignBuilder.createRandomActionContent()
    .name(name)
    .userId(userId)
    .save(prisma)
}
