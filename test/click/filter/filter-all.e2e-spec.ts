import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { createAuthUser } from '../../utils/helpers'
import { AppModule } from '@/app.module'
import { configureApp } from '@/utils/configure-app'
import { CampaignBuilder } from '@/utils/entity-builder/campaign-builder'
import { StreamActionType } from '@/campaign/entity/stream.entity'
import { FilterLogic, FilterObject } from '@/stream-filter/types'
import { ClickActionBuilder } from '../../utils/click-action-builder'
import { truncateTables } from '../../utils/truncate-tables'

function addStream(
  campaign: CampaignBuilder,
  content: string,
  filter?: FilterObject,
) {
  campaign.addStreamTypeAction((stream) => {
    stream.name(content).type(StreamActionType.SHOW_TEXT).content(content)

    if (filter) {
      stream.filters({
        logic: FilterLogic.And,
        items: [filter],
      })
    }
  })
}

describe('Filter all (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let userId: string
  const code1 = 'abcdif'

  afterAll(async () => {
    await truncateTables()
    await app.close()
  })

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    configureApp(app)
    await app.init()
    const authData = await createAuthUser(app)
    dataSource = app.get(DataSource)
    userId = authData.user.id

    console.time()
    const builder = CampaignBuilder.create()
      .name('Test campaign')
      .code(code1)
      .userId(userId)

    addStream(builder, 'referer', {
      type: 'referer',
      values: ['Value referer'],
    })

    addStream(builder, 'source', {
      type: 'source',
      values: ['Value source'],
    })

    addStream(builder, 'keyword', {
      type: 'keyword',
      values: ['Value keyword'],
    })

    addStream(builder, 'adCampaignId', {
      type: 'adCampaignId',
      values: ['Value adCampaignId'],
    })

    addStream(builder, 'creativeId', {
      type: 'creativeId',
      values: ['Value creativeId'],
    })

    addStream(builder, 'os', {
      type: 'os',
      values: ['Windows'],
    })

    addStream(builder, 'osVersion', {
      type: 'osVersion',
      values: ['13.2.3'],
    })

    addStream(builder, 'Last stream')

    await builder.save(dataSource)
    console.timeEnd()
  })

  it('referer', async () => {
    const { text } = await ClickActionBuilder.create(app)
      .setCode(code1)
      .addHeader('Referer', 'Value referer')
      .request()

    expect(text).toBe('referer')
  })

  it('source', async () => {
    const { text } = await ClickActionBuilder.create(app)
      .setCode(code1)
      .addQueryParam('source', 'Value source')
      .request()

    expect(text).toBe('source')
  })

  it('keyword', async () => {
    const { text } = await ClickActionBuilder.create(app)
      .setCode(code1)
      .addQueryParam('keyword', 'Value keyword')
      .request()

    expect(text).toBe('keyword')
  })

  it('adCampaignId', async () => {
    const { text } = await ClickActionBuilder.create(app)
      .setCode(code1)
      .addQueryParam('ad_campaign_id', 'Value adCampaignId')
      .request()

    expect(text).toBe('adCampaignId')
  })

  it('creativeId', async () => {
    const { text } = await ClickActionBuilder.create(app)
      .setCode(code1)
      .addQueryParam('creative_id', 'Value creativeId')
      .request()

    expect(text).toBe('creativeId')
  })

  it('os', async () => {
    const { text } = await ClickActionBuilder.create(app)
      .setCode(code1)
      .addHeader(
        'user-agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      )
      .request()

    expect(text).toBe('os')
  })

  it('osVersion', async () => {
    const { text } = await ClickActionBuilder.create(app)
      .setCode(code1)
      .addHeader(
        'user-agent',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      )
      .request()

    expect(text).toBe('osVersion')
  })
})
