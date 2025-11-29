import { INestApplication } from '@nestjs/common'
import { VISITOR_ID_SIZE } from '@/domain/click/observers/id-generator'
import { createCampaignContent } from '../utils/campaign-builder-facades/create-campaign-content'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { createAuthUser } from '../utils/helpers'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { ClickRequestBuilder } from '../utils/click-builders/click-request-builder'

describe('visitorId (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clickRepo: ClickRepository
  let userId: string

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
    app = await createApp()
    prisma = app.get(PrismaService)
    clickRepo = app.get(ClickRepository)
    const authData = await createAuthUser(app)
    userId = authData.user.id
  })

  it('Should be receive visitor id form cookie', async () => {
    // Arrange
    const campaign = await createCampaignContent({
      prisma,
      userId,
    })

    // Act
    const response = await ClickRequestBuilder.create(app)
      .code(campaign.code)
      .waitRegister()
      .request()
      .expect(200)

    const cookies = response.get('Set-Cookie')!
    const clicks = await clickRepo.getByCampaignId(campaign.id)
    const visitorId = getVisitorId(cookies)

    // Assert
    expect(clicks).toHaveLength(1)
    expect(Array.isArray(cookies)).toBe(true)
    expect(cookies).not.toHaveLength(0)
    expect(visitorId).toEqual(clicks[0].visitorId)
  })

  it('Should return the same visitorId that was passed in the cookie', async () => {
    // Arrange
    const existsVisitorId = 'abc123'
    const campaign = await createCampaignContent({
      prisma,
      userId,
    })

    // Act
    const response = await ClickRequestBuilder.create(app)
      .code(campaign.code)
      .setVisitorId(existsVisitorId)
      .waitRegister()
      .request()
      .expect(200)

    const cookies = response.get('Set-Cookie')!
    const clicks = await clickRepo.getByCampaignId(campaign.id)
    const visitorId = getVisitorId(cookies)

    // Assert
    expect(existsVisitorId).toHaveLength(VISITOR_ID_SIZE)
    expect(clicks).toHaveLength(1)
    expect(Array.isArray(cookies)).toBe(true)
    expect(cookies).not.toHaveLength(0)
    expect(visitorId).toEqual(clicks[0].visitorId)
    expect(visitorId).toEqual('abc123')
  })
})

function getVisitorId(cookies: string[]): string | undefined {
  for (const coo of cookies) {
    if (coo.substring(0, 9) != 'visitorId') {
      continue
    }

    return coo.split('; ')[0].split('=')[1]
  }
}
