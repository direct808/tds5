import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { createAuthUser } from '../../utils/helpers'
import { CampaignBuilder } from '../../utils/entity-builder/campaign-builder'
import { StreamActionType } from '@/domain/campaign/types'
import { FilterLogic } from '@/domain/click/stream/filter/types'
import { ClickRequestBuilder } from '../../utils/click-builders/click-request-builder'
import { DateTime } from 'luxon'
import { ClickBuilder } from '../../utils/entity-builder/click-builder'
import { faker } from '@faker-js/faker'
import { flushRedisDb, truncateTables } from '../../utils/truncate-tables'
import { createApp } from '../../utils/create-app'
import { Click } from '@/domain/click/click.entity'

async function clickAction(
  app: INestApplication,
  code: string,
): Promise<string> {
  const { text } = await ClickRequestBuilder.create(app)
    .code(code)
    .waitRegister()
    .request()
    .expect(200)

  return text
}

function createClick(
  campaignId: string,
  createdAt: DateTime,
  dataSource: DataSource,
): Promise<Click> {
  return ClickBuilder.create()
    .id(faker.string.alpha(12))
    .campaignId(campaignId)
    .visitorId(faker.string.alpha(6))
    .createdAt(createdAt.toJSDate())
    .save(dataSource)
}

describe('Filter click limit (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let userId: string
  const code1 = 'abcdif'
  const code2 = 'abcdi2'

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

  it('Checks click limit total', async () => {
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
            items: [{ type: 'click-limit', total: 2 }],
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
    const content2 = await clickAction(app, code2)
    const content3 = await clickAction(app, code2)
    const content4 = await clickAction(app, code2)

    // 3. Assert
    expect(content1).toBe('Custom')
    expect(content2).toBe('First stream')
    expect(content3).toBe('First stream')
    expect(content4).toBe('Last stream')
  })

  it('Checks click limit perHour', async () => {
    // 1. Arrange
    const firstCampaign = await CampaignBuilder.create()
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

    const lastCampaign = await CampaignBuilder.create()
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
            items: [{ type: 'click-limit', perHour: 2 }],
          }),
      )
      .addStreamTypeAction((stream) =>
        stream
          .name('Last stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Last stream'),
      )
      .save(dataSource)

    const dateTime = DateTime.now().minus({ hour: 4 })

    // 2. Act
    await createClick(firstCampaign.id, dateTime, dataSource)
    await createClick(lastCampaign.id, dateTime, dataSource)

    const content1 = await clickAction(app, code2)
    const content2 = await clickAction(app, code2)
    const content3 = await clickAction(app, code2)

    // 3. Assert
    expect(content1).toBe('First stream')
    expect(content2).toBe('First stream')
    expect(content3).toBe('Last stream')
  })

  it('Checks click limit perDay', async () => {
    // 1. Arrange
    const firstCampaign = await CampaignBuilder.create()
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

    const lastCampaign = await CampaignBuilder.create()
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
            items: [{ type: 'click-limit', perDay: 2 }],
          }),
      )
      .addStreamTypeAction((stream) =>
        stream
          .name('Last stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('Last stream'),
      )
      .save(dataSource)

    const dateTime = DateTime.now().minus({ day: 4 })

    // 2. Act
    await createClick(firstCampaign.id, dateTime, dataSource)
    await createClick(lastCampaign.id, dateTime, dataSource)

    const content1 = await clickAction(app, code2)
    const content2 = await clickAction(app, code2)
    const content3 = await clickAction(app, code2)

    // 3. Assert
    expect(content1).toBe('First stream')
    expect(content2).toBe('First stream')
    expect(content3).toBe('Last stream')
  })
})
