import { INestApplication } from '@nestjs/common'
import { createAuthUser } from '../../utils/helpers'
import { CampaignBuilder } from '../../utils/entity-builder/campaign-builder'
import { FilterLogic, FilterObject } from '@/domain/click/stream/filter/types'
import { ClickRequestBuilder } from '../../utils/click-builders/click-request-builder'
import { flushRedisDb, truncateTables } from '../../utils/truncate-tables'
import { createApp } from '../../utils/create-app'
import { ClickDataTextKeys } from '@/domain/click/stream/filter/filters/click-data-text/click-data-text-filter'
import { RequestAdapterFactory } from '@/shared/request-adapter/request-adapter-factory'
import { DateTime } from 'luxon'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { StreamActionTypeEnum } from '@generated/prisma/enums'

async function addStream(
  prisma: PrismaService,
  content: string,
  userId: string,
  filter?: FilterObject,
): Promise<void> {
  const campaign = CampaignBuilder.create()
    .name('Test campaign')
    .code('abcdif')
    .userId(userId)

  campaign.addStreamTypeAction((stream) => {
    stream.name(content).type(StreamActionTypeEnum.SHOW_TEXT).content(content)

    if (filter) {
      stream.filters({
        logic: FilterLogic.And,
        items: [filter],
      })
    }
  })

  await campaign.save(prisma)
}

describe('Filter all (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userId: string
  const code1 = 'abcdif'

  afterEach(async () => {
    await app.close()
    jest.useRealTimers()
  })

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
    app = await createApp()
    const authData = await createAuthUser(app)
    prisma = app.get(PrismaService)
    userId = authData.user.id
    jest.useFakeTimers({ doNotFake: ['nextTick'] })
  })

  it.each([
    ['source', 'source'],
    ['keyword', 'keyword'],
    ['adCampaignId', 'ad_campaign_id'],
    ['creativeId', 'creative_id'],
    ['subId1', 'sub_id_1'],
    ['subId2', 'sub_id_2'],
    ['extraParam1', 'extra_param_1'],
    ['extraParam2', 'extra_param_2'],
  ])('Click data %s', async (type, snake) => {
    const value = 'Value ' + type
    await addStream(prisma, type, userId, {
      type: type as ClickDataTextKeys,
      values: [value],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .addQueryParam(snake, value)
      .waitRegister()
      .request()

    expect(text).toBe(type)
  })

  it('Raw query param', async () => {
    await addStream(prisma, 'raw_query_content', userId, {
      type: 'query-param',
      name: 'raw_query',
      values: ['raw_query_value'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .addQueryParam('raw_query', 'raw_query_value')
      .waitRegister()
      .request()

    expect(text).toBe('raw_query_content')
  })

  it('os', async () => {
    await addStream(prisma, 'os', userId, {
      type: 'os',
      values: ['Windows'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .addHeader(
        'user-agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      )
      .waitRegister()
      .request()

    expect(text).toBe('os')
  })

  it('osVersion', async () => {
    await addStream(prisma, 'osVersion', userId, {
      type: 'osVersion',
      values: ['10'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .addHeader(
        'user-agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      )
      .waitRegister()
      .request()

    expect(text).toBe('osVersion')
  })

  it('ip', async () => {
    await addStream(prisma, 'ip', userId, {
      type: 'ip',
      values: ['192.168.10.20'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .ip('192.168.10.20')
      .waitRegister()
      .request()

    expect(text).toBe('ip')
  })

  it('ipv6', async () => {
    await addStream(prisma, 'ipv6', userId, {
      type: 'ipv6',
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .ip('::7711')
      .waitRegister()
      .request()

    expect(text).toBe('ipv6')
  })

  it('schedule', async () => {
    jest.setSystemTime(DateTime.fromISO('2025-08-05T10:33+03:00').toJSDate())
    await addStream(prisma, 'schedule', userId, {
      type: 'schedule',
      timezone: 'Europe/Moscow',
      items: [{ fromDay: 2, formTime: '10:30', toDay: 2, toTime: '11:30' }],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .waitRegister()
      .request()

    expect(text).toBe('schedule')
  })

  it('date-interval', async () => {
    jest.setSystemTime(DateTime.fromISO('2025-08-05T10:33').toJSDate())

    await addStream(prisma, 'date-interval', userId, {
      type: 'date-interval',
      from: '2025-08-05',
      to: '2025-08-06',
      timezone: 'Europe/Moscow',
    })

    const { text } = await ClickRequestBuilder.create(app)
      .code(code1)
      .waitRegister()
      .request()

    expect(text).toBe('date-interval')
  })
})
