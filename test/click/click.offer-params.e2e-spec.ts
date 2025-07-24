import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource } from 'typeorm'
import { ClickRepository } from '@/click/shared/click.repository'
import { loadUserFixtures, truncateTables } from '../utils/helpers'
import { AppModule } from '@/app.module'
import { configureApp } from '@/utils/configure-app'
import { CampaignBuilder } from '@/utils/entity-builder/campaign-builder'

describe('Offer params (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let clickRepo: ClickRepository
  const userId = '00000000-0000-4000-8000-000000000001'

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
