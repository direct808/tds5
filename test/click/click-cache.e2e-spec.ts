import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { createApp } from '../utils/create-app'
import { createAuthUser } from '../utils/helpers'
import { StreamActionType } from '@/campaign/types'
import { ClickActionBuilder } from '../utils/click-action-builder'
import { SourceBuilder } from '../utils/entity-builder/source-builder'
import request from 'supertest'
import { RedisFullCampaignProvider } from '@/campaign/full-campaign-provider/redis-full-campaign-provider'
import { spyOn } from '../utils/helpers'

describe('Click-cache (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let userId: string
  let campaignProvider: RedisFullCampaignProvider
  const code = 'abcdif'
  let accessToken: string

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])
  })

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    app = await createApp()
    dataSource = app.get(DataSource)
    campaignProvider = app.get(RedisFullCampaignProvider)
    const authData = await createAuthUser(app)
    userId = authData.user.id
    accessToken = authData.accessToken
  })

  it('Checks full click data values', async () => {
    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .addStreamTypeAction((stream) => {
        stream
          .name('Stream 1')
          .type(StreamActionType.SHOW_TEXT)
          .content('Campaign content')
      })
      .save(dataSource)

    const getCampaignFromDb = spyOn(campaignProvider, 'getCampaignFromDb')

    // Act
    const { text: content1 } = await ClickActionBuilder.create(app)
      .setCode(code)
      .request()

    const { text: content2 } = await ClickActionBuilder.create(app)
      .setCode(code)
      .request()

    // Assert
    expect(content1).toBe('Campaign content')
    expect(content2).toBe('Campaign content')
    expect(getCampaignFromDb).toBeCalledTimes(1)
  })

  it('Checks full click data 12312231', async () => {
    const source = await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(dataSource)

    await CampaignBuilder.create()
      .name('Test campaign 1')
      .sourceId(source.id)
      .code(code)
      .userId(userId)
      .addStreamTypeAction((stream) => {
        stream
          .name('Stream 1')
          .type(StreamActionType.SHOW_TEXT)
          .content('Campaign content')
      })
      .save(dataSource)

    const getCampaignFromDb = spyOn(campaignProvider, 'getCampaignFromDb')

    // Act
    const { text: content1 } = await ClickActionBuilder.create(app)
      .setCode(code)
      .request()

    const { text: content2 } = await ClickActionBuilder.create(app)
      .setCode(code)
      .request()

    await request(app.getHttpServer())
      .patch('/api/source/' + source.id)
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    const { text: content3 } = await ClickActionBuilder.create(app)
      .setCode(code)
      .request()

    // Assert
    expect(content1).toBe('Campaign content')
    expect(content2).toBe('Campaign content')
    expect(getCampaignFromDb).toBeCalledTimes(2)
  })
})
