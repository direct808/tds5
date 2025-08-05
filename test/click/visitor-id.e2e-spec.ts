import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource } from 'typeorm'
import { ClickRepository } from '@/click/click.repository'
import { createAuthUser, truncateTables } from '../utils/helpers'
import { VISITOR_ID_SIZE } from '@/click/observers/id-generator'
import { createCampaignContent } from '../utils/campaign-builder-facades/create-campaign-content'
import { createApp } from '../utils/create-app'

describe('visitorId (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let clickRepo: ClickRepository
  let userId: string

  afterEach(async () => {
    await truncateTables(app)
    await app.close()
  })

  beforeEach(async () => {
    app = await createApp()
    dataSource = app.get(DataSource)
    clickRepo = app.get(ClickRepository)
    const authData = await createAuthUser(app)
    userId = authData.user.id
  })

  it('Should be receive visitor id form cookie', async () => {
    // Arrange
    const campaign = await createCampaignContent({
      dataSource,
      userId,
    })

    // Act
    const response = await request(app.getHttpServer())
      .get(`/${campaign.code}`)
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
      dataSource,
      userId,
    })

    // Act
    const response = await request(app.getHttpServer())
      .get(`/${campaign.code}`)
      .set('Cookie', ['visitorId=' + existsVisitorId])
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
