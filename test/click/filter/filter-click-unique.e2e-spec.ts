import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { createAuthUser } from '../../utils/helpers'
import { CampaignBuilder } from '../../utils/entity-builder/campaign-builder'
import { StreamActionType } from '@/domain/campaign/types'
import { FilterLogic } from '@/domain/click/stream/filter/types'
import { ClickRequestBuilder } from '../../utils/click-request-builder'
import { flushRedisDb, truncateTables } from '../../utils/truncate-tables'
import { ClickUniqueFor } from '@/domain/click/stream/filter/filters/click-unique/click-unique-filter'
import { createApp } from '../../utils/create-app'
import { setTimeout } from 'timers/promises'

async function clickAction(
  app: INestApplication,
  code: string,
  visitorId?: string,
): Promise<string> {
  const builder = ClickRequestBuilder.create(app).setCode(code)

  if (visitorId) {
    builder.setVisitorId(visitorId)
  }

  const { text } = await builder.request().expect(200)

  return text
}

describe('Filter click unique (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let userId: string
  const code1 = 'abcdif'
  const code2 = 'abcdi2'
  const visitorId = '5ilzrg'

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
    app = await createApp()
    dataSource = app.get(DataSource)
    const authData = await createAuthUser(app)
    userId = authData.user.id
  })

  it('Checks click unique for allCampaigns', async () => {
    // 1. Arrange
    await CampaignBuilder.create()
      .name('Other campaign')
      .code(code1)
      .userId(userId)
      .addStreamTypeAction((stream) =>
        stream
          .name('First stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Custom'),
      )
      .save(dataSource)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code2)
      .userId(userId)
      .addStreamTypeAction((stream) =>
        stream
          .name('First stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('First stream')
          .filters({
            logic: FilterLogic.And,
            items: [{ type: 'click-unique', for: ClickUniqueFor.allCampaigns }],
          }),
      )
      .addStreamTypeAction((stream) =>
        stream
          .name('Last stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Last stream'),
      )
      .save(dataSource)

    // 2. Act
    const content1 = await clickAction(app, code1)
    await setTimeout(10)
    const content2 = await clickAction(app, code2)
    await setTimeout(10)
    const content3 = await clickAction(app, code1, visitorId)
    await setTimeout(10)
    const content4 = await clickAction(app, code2, visitorId)

    // 3. Assert
    expect(content1).toBe('Custom')
    expect(content2).toBe('First stream')
    expect(content3).toBe('Custom')
    expect(content4).toBe('Last stream')
  })

  it('Checks click unique for campaign', async () => {
    // 1. Arrange
    await CampaignBuilder.create()
      .name('Other campaign')
      .code(code1)
      .userId(userId)
      .addStreamTypeAction((stream) =>
        stream
          .name('First stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Custom'),
      )
      .save(dataSource)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code2)
      .userId(userId)
      .addStreamTypeAction((stream) =>
        stream
          .name('First stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('First stream')
          .filters({
            logic: FilterLogic.And,
            items: [{ type: 'click-unique', for: ClickUniqueFor.campaign }],
          }),
      )
      .addStreamTypeAction((stream) =>
        stream
          .name('Last stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Last stream'),
      )
      .save(dataSource)

    // 2. Act
    const content1 = await clickAction(app, code1, visitorId)
    await setTimeout(10)
    const content2 = await clickAction(app, code2, visitorId)
    await setTimeout(10)
    const content3 = await clickAction(app, code2, visitorId)

    // 3. Assert
    expect(content1).toBe('Custom')
    expect(content2).toBe('First stream')
    expect(content3).toBe('Last stream')
  })

  it('Checks click unique for stream', async () => {
    // 1. Arrange
    await CampaignBuilder.create()
      .name('Other campaign')
      .code(code1)
      .userId(userId)
      .addStreamTypeAction((stream) =>
        stream
          .name('First stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Custom'),
      )
      .save(dataSource)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code2)
      .userId(userId)
      .addStreamTypeAction((stream) =>
        stream
          .name('First stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('First stream')
          .filters({
            logic: FilterLogic.And,
            items: [{ type: 'click-unique', for: ClickUniqueFor.stream }],
          }),
      )
      .addStreamTypeAction((stream) =>
        stream
          .name('Second stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Second stream')
          .filters({
            logic: FilterLogic.And,
            items: [{ type: 'click-unique', for: ClickUniqueFor.stream }],
          }),
      )
      .addStreamTypeAction((stream) =>
        stream
          .name('Last stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Last stream'),
      )
      .save(dataSource)

    // 2. Act
    const content1 = await clickAction(app, code1, visitorId)
    await setTimeout(10)
    const content2 = await clickAction(app, code2, visitorId)
    await setTimeout(10)
    const content3 = await clickAction(app, code2, visitorId)
    await setTimeout(10)
    const content4 = await clickAction(app, code2, visitorId)

    // 3. Assert
    expect(content1).toBe('Custom')
    expect(content2).toBe('First stream')
    expect(content3).toBe('Second stream')
    expect(content4).toBe('Last stream')
  })
})
