import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { createAuthUser } from '../../utils/helpers'
import { CampaignBuilder } from '../../utils/entity-builder/campaign-builder'
import { StreamActionType } from '@/domain/campaign/types'
import { FilterLogic, FilterObject } from '@/domain/click/stream/filter/types'
import { ClickRequestBuilder } from '../../utils/click-request-builder'
import { flushRedisDb, truncateTables } from '../../utils/truncate-tables'
import { createApp } from '../../utils/create-app'
import { ClickDataTextKeys } from '@/domain/click/stream/filter/filters/click-data-text/click-data-text-filter'
import { FakeIpExpressRequestAdapter } from '../../utils/fake-ip-express-request-adapter'
import { RequestAdapterFactory } from '@/shared/request-adapter/request-adapter-factory'
import { DateTime } from 'luxon'

async function addStream(
  dataSource: DataSource,
  content: string,
  userId: string,
  filter?: FilterObject,
) {
  const campaign = CampaignBuilder.create()
    .name('Test campaign')
    .code('abcdif')
    .userId(userId)

  campaign.addStreamTypeAction((stream) => {
    stream.name(content).type(StreamActionType.SHOW_TEXT).content(content)

    if (filter) {
      stream.filters({
        logic: FilterLogic.And,
        items: [filter],
      })
    }
  })

  await campaign.save(dataSource)
}

describe('Filter all (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
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
    dataSource = app.get(DataSource)
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
    await addStream(dataSource, type, userId, {
      type: type as ClickDataTextKeys,
      values: [value],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .addQueryParam(snake, value)
      .request()

    expect(text).toBe(type)
  })

  it('Raw query param', async () => {
    await addStream(dataSource, 'raw_query_content', userId, {
      type: 'query-param',
      name: 'raw_query',
      values: ['raw_query_value'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .addQueryParam('raw_query', 'raw_query_value')
      .request()

    expect(text).toBe('raw_query_content')
  })

  it('os', async () => {
    await addStream(dataSource, 'os', userId, {
      type: 'os',
      values: ['Windows'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .addHeader(
        'user-agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      )
      .request()

    expect(text).toBe('os')
  })

  it('osVersion', async () => {
    await addStream(dataSource, 'osVersion', userId, {
      type: 'osVersion',
      values: ['10'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .addHeader(
        'user-agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      )
      .request()

    expect(text).toBe('osVersion')
  })

  it('ip', async () => {
    const factory = app.get(RequestAdapterFactory)

    jest
      .spyOn(factory, 'create')
      .mockImplementation(
        (req) => new FakeIpExpressRequestAdapter(req, '192.168.10.20'),
      )

    await addStream(dataSource, 'ip', userId, {
      type: 'ip',
      values: ['192.168.10.20'],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .request()

    expect(text).toBe('ip')
  })

  it('ipv6', async () => {
    const factory = app.get(RequestAdapterFactory)

    jest
      .spyOn(factory, 'create')
      .mockImplementation(
        (req) => new FakeIpExpressRequestAdapter(req, '::7711'),
      )

    await addStream(dataSource, 'ipv6', userId, {
      type: 'ipv6',
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .request()

    expect(text).toBe('ipv6')
  })

  it('schedule', async () => {
    jest.setSystemTime(DateTime.fromISO('2025-08-05T10:33+03:00').toJSDate())
    await addStream(dataSource, 'schedule', userId, {
      type: 'schedule',
      timezone: 'Europe/Moscow',
      items: [{ fromDay: 2, formTime: '10:30', toDay: 2, toTime: '11:30' }],
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .request()

    expect(text).toBe('schedule')
  })

  it('date-interval', async () => {
    jest.setSystemTime(DateTime.fromISO('2025-08-05T10:33').toJSDate())

    await addStream(dataSource, 'date-interval', userId, {
      type: 'date-interval',
      from: '2025-08-05',
      to: '2025-08-06',
      timezone: 'Europe/Moscow',
    })

    const { text } = await ClickRequestBuilder.create(app)
      .setCode(code1)
      .request()

    expect(text).toBe('date-interval')
  })
})
