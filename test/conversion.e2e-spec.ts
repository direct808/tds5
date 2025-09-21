import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { createAuthUser } from './utils/helpers'
import { createApp } from './utils/create-app'
import { CampaignBuilder } from './utils/entity-builder/campaign-builder'
import { ClickRequestBuilder } from './utils/click-request-builder'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { flushRedisDb, truncateTables } from './utils/truncate-tables'
import { PostbackRequestBuilder } from './utils/postback-request-builder'

describe('Conversion (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let clickRepository: ClickRepository
  let userId: string
  let conversionRepository: ConversionRepository

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
    app = await createApp()
    dataSource = app.get(DataSource)

    const authData = await createAuthUser(app)
    userId = authData.user.id
    conversionRepository = app.get(ConversionRepository)
    clickRepository = app.get(ClickRepository)
  })

  it('Create conversion', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    await ClickRequestBuilder.create(app)
      .code(campaign.code)
      .waitRegister()
      .request()

    const [click] = await clickRepository.getByCampaignId(campaign.id)

    await PostbackRequestBuilder.create(app)
      .subid(click.id)
      .addQueryParam('status', 'custom-status')
      .addQueryParam('rejected_status', 'status1,custom-status')
      .request()

    const conversion = await conversionRepository.getList()

    expect(conversion.length).toBe(1)
    expect(conversion[0]).toEqual(
      expect.objectContaining({
        clickId: click.id,
        originalStatus: 'custom-status',
        params: {
          rejected_status: 'status1,custom-status',
          status: 'custom-status',
          subid: click.id,
        },
        previousStatus: null,
        status: 'rejected',
      }),
    )
  })

  it('Create second conversion', async () => {
    const campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(dataSource)

    await ClickRequestBuilder.create(app)
      .code(campaign.code)
      .waitRegister()
      .request()

    const [click] = await clickRepository.getByCampaignId(campaign.id)

    await PostbackRequestBuilder.create(app).subid(click.id).request()

    await PostbackRequestBuilder.create(app)
      .subid(click.id)
      .addQueryParam('status', 'custom-status')
      .addQueryParam('rejected_status', 'status1,custom-status')
      .request()

    const conversion = await conversionRepository.getList()

    expect(conversion.length).toBe(1)
    expect(conversion[0]).toEqual(
      expect.objectContaining({
        clickId: click.id,
        originalStatus: 'custom-status',
        params: {
          rejected_status: 'status1,custom-status',
          status: 'custom-status',
          subid: click.id,
        },
        previousStatus: 'sale',
        status: 'rejected',
      }),
    )
  })
})
