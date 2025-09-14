import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { createAuthUser } from '../utils/helpers'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { ClickRepository } from '@/click/shared/click.repository'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'

describe('Offer params (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let clickRepo: ClickRepository
  let userId: string

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
    app = await createApp()
    dataSource = app.get(DataSource)
    clickRepo = app.get(ClickRepository)
    const authData = await createAuthUser(app)
    userId = authData.user.id
  })

  it('Should be replace offer params', async () => {
    // Arrange
    const campaignName = 'Campaign !'
    const campaignNameEncoded = encodeURIComponent(campaignName)

    const campaign = await CampaignBuilder.create()
      .name(campaignName)
      .code('codess')
      .userId(userId)
      .addStreamTypeOffers((builder) =>
        builder.name('Stream 1').addOffer((streamOffer) =>
          streamOffer.percent(100).createOffer((offer) =>
            offer
              .name('Offer 1')
              .userId(userId)
              .url('http://localhost:8080?self_param=param_a')
              .createAffiliateNetwork((affiliateNetwork) =>
                affiliateNetwork
                  .name('Affiliate network 1')
                  .userId(userId)
                  .offerParams(
                    `?click_id={subid}&camp_name={campaign_name}postfix`,
                  ),
              ),
          ),
        ),
      )
      .save(dataSource)

    // Act
    const response = await request(app.getHttpServer())
      .get(`/${campaign.code}`)
      .expect(302)

    const clicks = await clickRepo.getByCampaignId(campaign.id)
    const clickId = clicks[0].id

    // Assert
    expect(clicks).toHaveLength(1)
    expect(response.headers.location).toBe(
      `http://localhost:8080?` +
        new URLSearchParams(
          `self_param=param_a&click_id=${clickId}&camp_name=${campaignNameEncoded}postfix`,
        ).toString(),
    )
  })
})
