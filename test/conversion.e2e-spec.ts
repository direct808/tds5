import { INestApplication } from '@nestjs/common'
import { createAuthUser } from './utils/helpers'
import { createApp } from './utils/create-app'
import {
  CampaignBuilder,
  CampaignFull,
} from './utils/entity-builder/campaign-builder'
import { ClickRequestBuilder } from './utils/click-builders/click-request-builder'
import { ConversionRepository } from '@/infra/repositories/conversion.repository'
import { ClickRepository } from '@/infra/repositories/click.repository'
import { flushRedisDb, truncateTables } from './utils/truncate-tables'
import { PostbackRequestBuilder } from './utils/postback-request-builder'
import { waitConversionRegistered } from './utils/waitConversionRegister'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { spyOn } from './utils/helpers'
import { setTimeout } from 'timers/promises'
import { ConversionRegisterUseCase } from '@/domain/conversion/use-cases/conversion-register.use-case'
import { MockRequestAdapter } from './utils/mock-request-adapter'
import { ClickBuilder } from './utils/entity-builder/click-builder'

describe('Conversion (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clickRepository: ClickRepository
  let conversionRepository: ConversionRepository
  let usecase: ConversionRegisterUseCase
  let userId: string
  let campaign: CampaignFull

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
    app = await createApp()
    prisma = app.get(PrismaService)
    clickRepository = app.get(ClickRepository)
    conversionRepository = app.get(ConversionRepository)
    usecase = app.get(ConversionRegisterUseCase)

    const authData = await createAuthUser(app)
    userId = authData.user.id

    campaign = await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .save(prisma)
  })

  it('Конверсия не должна создаться если не передан subid', async () => {
    const requestAdapter = MockRequestAdapter.create()

    await usecase.handle(requestAdapter)

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(0)
  })

  it('Конверсия не должна создаться если передан несуществующий subid и передан статус', async () => {
    const requestAdapter = MockRequestAdapter.create()
      .query('subid', 'hz')
      .query('status', 'hz-staus')

    await usecase.handle(requestAdapter)

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(0)
  })

  it('Конверсия не должна создаться если передан существующий subid и не передан статус', async () => {
    const click = await ClickBuilder.create()
      .campaignId(campaign.id)
      .id('sub-id')
      .save(prisma)

    const requestAdapter = MockRequestAdapter.create().query('subid', click.id)

    await usecase.handle(requestAdapter)

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(0)
  })

  it('Конверсия не должна создаться если передан существующий subid и передан неопознанный статус', async () => {
    const click = await ClickBuilder.create()
      .campaignId(campaign.id)
      .id('sub-id')
      .save(prisma)

    const requestAdapter = MockRequestAdapter.create()
      .query('subid', click.id)
      .query('status', 'hz-status')

    await usecase.handle(requestAdapter)

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(0)
  })

  it('Конверсия должна создаться если передан существующий subid и передан известный статус', async () => {
    const click = await ClickBuilder.create()
      .campaignId(campaign.id)
      .id('sub-id')
      .save(prisma)

    const requestAdapter = MockRequestAdapter.create()
      .query('subid', click.id)
      .query('status', 'sale')

    await usecase.handle(requestAdapter)

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(1)
    expect(conversions[0]).toEqual(
      expect.objectContaining({
        clickId: click.id,
        originalStatus: 'sale',
        status: 'sale',
        params: {
          status: 'sale',
          subid: click.id,
        },
      }),
    )
  })

  it('Конверсия должна создаться если передан существующий subid и передан неизвестный статус, но передан ствтус в обучении', async () => {
    const click = await ClickBuilder.create()
      .campaignId(campaign.id)
      .id('sub-id')
      .save(prisma)

    const requestAdapter = MockRequestAdapter.create()
      .query('subid', click.id)
      .query('status', 'hz-status')
      .query('sale_status', 'hz-status')

    await usecase.handle(requestAdapter)

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(1)
    expect(conversions[0]).toEqual(
      expect.objectContaining({
        clickId: click.id,
        originalStatus: 'hz-status',
        params: {
          status: 'hz-status',
          sale_status: 'hz-status',
          subid: click.id,
        },
        previousStatus: null,
        status: 'sale',
      }),
    )
  })

  it('Вторая конверсия с тем же subid должна перезаписаться', async () => {
    const click = await ClickBuilder.create()
      .campaignId(campaign.id)
      .id('sub-id')
      .save(prisma)

    const requestAdapter = MockRequestAdapter.create().query('subid', click.id)

    await usecase.handle(requestAdapter.query('status', 'lead'))
    await usecase.handle(requestAdapter.query('status', 'sale'))

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(1)
    expect(conversions[0]).toEqual(
      expect.objectContaining({
        clickId: click.id,
        originalStatus: 'sale',
        previousStatus: 'lead',
        status: 'sale',
        params: {
          status: 'sale',
          subid: click.id,
        },
      }),
    )
  })

  it('Вторая конверсия с тем же subid, но с tid должна создаться', async () => {
    const click = await ClickBuilder.create()
      .campaignId(campaign.id)
      .id('sub-id')
      .save(prisma)

    const requestAdapter = MockRequestAdapter.create().query('subid', click.id)

    await usecase.handle(requestAdapter.query('status', 'lead'))
    await usecase.handle(
      requestAdapter.query('status', 'sale').query('tid', 'trx-id'),
    )

    const conversions = await conversionRepository.getList()
    expect(conversions.length).toBe(2)

    expect(conversions[0]).toEqual(
      expect.objectContaining({
        clickId: click.id,
        originalStatus: 'sale',
        status: 'sale',
        tid: 'trx-id',
        params: {
          status: 'sale',
          subid: click.id,
          tid: 'trx-id',
        },
      }),
    )

    expect(conversions[1]).toEqual(
      expect.objectContaining({
        clickId: click.id,
        originalStatus: 'lead',
        status: 'lead',
        tid: null,
        params: {
          status: 'lead',
          subid: click.id,
        },
      }),
    )
  })
})
