import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DataSource } from 'typeorm'
import { ClickRepository } from '@/click/click.repository'
import { loadUserFixtures, truncateTables } from '../utils/helpers'
import { AppModule } from '@/app.module'
import { configureApp } from '@/utils/configure-app'
import { CampaignBuilder } from '@/utils/entity-builder/campaign-builder'
import { FilterLogic } from '@/stream-filter/types'
import { StreamActionType } from '@/campaign/entity/stream.entity'

describe('Click-filters (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  let clickRepo: ClickRepository
  const redirectUrl = 'https://example.com/'
  const userId = '00000000-0000-4000-8000-000000000001'
  const code = 'abcdif'
  const userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'

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

  it('Checks full click data values', async () => {
    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code(code)
      .userId(userId)
      .addStreamTypeAction((stream) => {
        stream
          .name('Stream 1')
          .type(StreamActionType.SHOW_TEXT)
          .content('value')
          .filters({
            logic: FilterLogic.Or,
            items: [
              {
                type: 'referer',
                exclude: false,
                values: ['value3', 'value2'],
              },
              {
                type: 'referer',
                exclude: false,
                values: ['value1', 'value2'],
              },
            ],
          })
      })
      .addStreamTypeAction((stream) =>
        stream
          .name('Last stream')
          .type(StreamActionType.SHOW_TEXT)
          .content('last'),
      )
      .save(dataSource)

    return request(app.getHttpServer())
      .get(`/${code}`)
      .set('Referer', 'value1')
      .expect('value')
  })
})
