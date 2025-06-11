import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { DataSource } from 'typeorm'
import {
  createTestContainer,
  loadUserFixtures,
  truncateTables,
} from './utils/helpers'
import { configureApp } from '../src/utils/configure-app'
import { CampaignBuilder } from '../src/utils/entity-builder/campaign-builder'
import {
  StreamActionType,
  StreamRedirectType,
} from '../src/campaign/entity/stream.entity'
import * as express from 'express'

describe('Click (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  const redirectUrl = 'https://example.com/'

  beforeAll(async () => {
    await createTestContainer()
  })

  afterEach(async () => {
    await truncateTables(app)
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    configureApp(app)
    await app.init()
    dataSource = app.get(DataSource)
    await loadUserFixtures(dataSource)
  })

  it('No campaign', async () => {
    return request(app.getHttpServer()).get('/gggggg').expect(404)
  })

  it('No streams', async () => {
    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code('abcdif')
      .userId('00000000-0000-4000-8000-000000000001')
      .save(dataSource)

    return request(app.getHttpServer()).get('/abcdif').expect(500)
  })

  describe('Schema type direct url', () => {
    it('type HTTP', async () => {
      await createRedirectCampaign(
        StreamRedirectType.HTTP,
        redirectUrl,
        dataSource,
      )

      const response = await request(app.getHttpServer())
        .get('/abcdif')
        .expect(302)

      expect(response.headers.location).toBe(redirectUrl)
    })

    it.each([
      [StreamRedirectType.CURL, 'Example Domain'],
      [StreamRedirectType.CURL, '<base href="//example.com/">'],
      [StreamRedirectType.JS, 'process();</script>'],
      [
        StreamRedirectType.META,
        `<meta http-equiv="REFRESH" content="1; URL='https://example.com/'">`,
      ],
      [
        StreamRedirectType.IFRAME,
        '<iframe src="https://example.com/"></iframe>',
      ],
      [
        StreamRedirectType.META2,
        `<meta http-equiv="REFRESH" content="1; URL=\'/gateway/`,
      ],
      [
        StreamRedirectType.META2,
        `<script type="application/javascript">window.location = "/gateway/`,
      ],
      [
        StreamRedirectType.FORM_SUBMIT,
        `<form action="https://example.com/" method="POST"></form>`,
      ],
      [
        StreamRedirectType.WITHOUT_REFERER,
        `window.frames[0].document.body.innerHTML = '<form target="_parent" method="post" action="https://example.com/"></form>'`,
      ],
    ])('type %s, content %s', async (type, content) => {
      await createRedirectCampaign(type, redirectUrl, dataSource)

      const response = await request(app.getHttpServer())
        .get('/abcdif')
        .expect(200)

      expect(response.text).toContain(content)
    })

    it('REMOTE redirect', async () => {
      await createRedirectCampaign(
        StreamRedirectType.REMOTE,
        'http://localhost:2345',
        dataSource,
      )

      createServer(2345, 'http://redirect.domain/')

      const response = await request(app.getHttpServer())
        .get('/abcdif')
        .expect(302)

      expect(response.headers.location).toContain(`http://redirect.domain/`)
    })
  })

  describe('Schema type action', () => {
    it.each([
      [StreamActionType.SHOW_TEXT, '<Content>', 200, '&lt;Content&gt;'],
      [StreamActionType.SHOW_HTML, '<Content>', 200, '<Content>'],
      [StreamActionType.NOTHING, '<Content>', 200, ''],
      [StreamActionType.SHOW404, '<Content>', 404, ''],
    ])(
      'type %s witch content %s should return status %i with content %s',
      async (action, content, status, body) => {
        await CampaignBuilder.create()
          .name('Test campaign 1')
          .code('abcdif')
          .userId('00000000-0000-4000-8000-000000000001')
          .addStreamTypeAction((stream) => {
            stream.name('Stream 1').type(action).content(content)
          })
          .save(dataSource)

        const response = await request(app.getHttpServer())
          .get('/abcdif')
          .expect(status)

        expect(response.text).toBe(body)
      },
    )

    it('type TO_CAMPAIGN', async () => {
      await CampaignBuilder.create()
        .name('Test campaign 1')
        .code('abcdif')
        .userId('00000000-0000-4000-8000-000000000001')
        .addStreamTypeAction((stream) => {
          stream
            .name('Stream 1')
            .type(StreamActionType.TO_CAMPAIGN)
            .createActionCampaign((campaign) => {
              campaign
                .name('Sub campaign')
                .userId('00000000-0000-4000-8000-000000000001')
                .code('subCampaign')
                .addStreamTypeAction((stream) => {
                  stream
                    .name('s1')
                    .type(StreamActionType.SHOW_TEXT)
                    .content('From sub campaign')
                })
            })
        })
        .save(dataSource)

      const response = await request(app.getHttpServer())
        .get('/abcdif')
        .expect(200)

      expect(response.text).toBe('From sub campaign')
    })
  })
})

function createRedirectCampaign(
  rt: StreamRedirectType,
  url: string,
  ds: DataSource,
) {
  return CampaignBuilder.create()
    .name('Test campaign 1')
    .code('abcdif')
    .userId('00000000-0000-4000-8000-000000000001')
    .addStreamTypeDirectUrl((stream) => {
      stream.name('Stream 1').url(url).redirectType(rt)
    })
    .save(ds)
}

function createServer(port: number, content: string) {
  const expressApp = express()
  expressApp.get('/', (req, res) => {
    res.send(content)
  })
  expressApp.listen(port).unref()
}
