import { INestApplication } from '@nestjs/common'
import { createAuthUser } from '../utils/helpers'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { ClickRequestBuilder } from '../utils/click-builders/click-request-builder'

describe('Offer params (e2e)', () => {
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
      .save(prisma)

    // Act
    // const response = await request(app.getHttpServer())
    //   .get(`/${campaign.code}`)
    //   .expect(302)

    const response = await ClickRequestBuilder.create(app)
      .code(campaign.code)
      .waitRegister()
      .request()

    const clicks = await clickRepo.getByCampaignId(campaign.id)
    const clickId = clicks[0]!.id

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
