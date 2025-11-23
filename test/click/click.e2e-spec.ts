import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'
import { StreamActionType, StreamRedirectType } from '@/domain/campaign/types'
import express from 'express'
import { createAuthUser } from '../utils/helpers'
import { createCampaignDirectUrl } from '../utils/campaign-builder-facades/create-campaign-direct-url'
import { createApp } from '../utils/create-app'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { RegisterClickService } from '@/domain/click/register-click.service'
import type { ClickData } from '@/domain/click/click-data'
import { ClickRequestBuilder } from '../utils/click-builders/click-request-builder'

describe('Click (e2e)', () => {
  let app: INestApplication
  let dataSource: DataSource
  const redirectUrl = 'https://example.com/'
  let userId: string

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

  it('No campaign', async () => {
    return request(app.getHttpServer()).get('/gggggg').expect(404)
  })

  it('No streams', async () => {
    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code('abcdif')
      .userId(userId)
      .save(dataSource)

    return request(app.getHttpServer()).get('/abcdif').expect(500)
  })

  it('No streamOffers', async () => {
    await CampaignBuilder.create()
      .name('Test campaign 1')
      .code('abcdif')
      .userId(userId)
      .addStreamTypeOffers((stream) => {
        stream.name('Name')
      })
      .save(dataSource)

    return request(app.getHttpServer()).get('/abcdif').expect(500)
  })

  it('Should return 404 if campaign active = false', async () => {
    await CampaignBuilder.create()
      .name('Test campaign 1')
      .active(false)
      .code('abcdif')
      .userId(userId)
      .addStreamTypeAction((stream) => {
        stream.name('Name').type(StreamActionType.SHOW_TEXT).content('content')
      })
      .save(dataSource)

    return request(app.getHttpServer()).get('/abcdif').expect(404)
  })

  describe('Schema type direct url', () => {
    it('type HTTP', async () => {
      const campaign = await createCampaignDirectUrl({
        redirectType: StreamRedirectType.HTTP,
        url: redirectUrl,
        dataSource,
        userId,
      })

      const response = await ClickRequestBuilder.create(app)
        .code(campaign.code)
        .waitRegister()
        .request()
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
      const campaign = await createCampaignDirectUrl({
        redirectType: type,
        url: redirectUrl,
        dataSource,
        userId,
      })

      const response = await ClickRequestBuilder.create(app)
        .code(campaign.code)
        .waitRegister()
        .request()
        .expect(200)

      expect(response.text).toContain(content)
    })

    it('REMOTE redirect', async () => {
      const campaign = await createCampaignDirectUrl({
        redirectType: StreamRedirectType.REMOTE,
        url: 'http://localhost:2345',
        dataSource,
        userId,
      })

      createServer(2345, 'http://redirect.domain/')

      const response = await ClickRequestBuilder.create(app)
        .code(campaign.code)
        .waitRegister()
        .request()
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
          .userId(userId)
          .addStreamTypeAction((stream) => {
            stream.name('Stream 1').type(action).content(content)
          })
          .save(dataSource)

        const response = await ClickRequestBuilder.create(app)
          .code('abcdif')
          .waitRegister()
          .request()
          .expect(status)

        expect(response.text).toBe(body)
      },
    )

    it('type TO_CAMPAIGN', async () => {
      // Arrange
      const res = await CampaignBuilder.create()
        .name('Test campaign 1')
        .code('abcdif')
        .userId(userId)
        .addStreamTypeAction((stream) => {
          stream
            .name('Stream 1')
            .type(StreamActionType.TO_CAMPAIGN)
            .createActionCampaign((campaign) => {
              campaign
                .name('Sub campaign')
                .userId(userId)
                .code('subCampaign')
                .addStreamTypeDirectUrl((stream) => {
                  stream
                    .name('s1')
                    .url(redirectUrl)
                    .redirectType(StreamRedirectType.HTTP)
                })
            })
        })
        .save(dataSource)

      const lastCampaign = res.streams[0].actionCampaign!
      const clickData: ClickData[] = []

      const registerClickService = jest
        .spyOn(app.get(RegisterClickService), 'register')
        .mockImplementation((cd: ClickData) => clickData.push(cd))

      // Act
      const response = await ClickRequestBuilder.create(app)
        .code('abcdif')
        .request()
        .expect(302)

      const firstClick = clickData[0]
      const lastClick = clickData[1]

      // Assert
      expect(response.headers.location).toBe(redirectUrl)

      expect(registerClickService).toHaveBeenCalledTimes(2)
      expect(clickData).toHaveLength(2)

      expect(firstClick.previousCampaignId).toBeFalsy()
      expect(lastClick.previousCampaignId).toBe(res.id)

      expect(firstClick.destination).toBe(lastCampaign.name)
      expect(lastClick.destination).toBe(redirectUrl)
    })
  })

  describe('Schema type offers', () => {
    it('Should be redirect', async () => {
      await CampaignBuilder.create()
        .name('Test campaign 1')
        .code('abcdif')
        .userId(userId)
        .addStreamTypeOffers((stream) => {
          stream.name('Stream 1').addOffer((so) => {
            so.percent(50).createOffer((offer) => {
              offer.name('Offer 2').url(redirectUrl).userId(userId)
            })
          })
        })
        .save(dataSource)

      const response = await ClickRequestBuilder.create(app)
        .code('abcdif')
        .waitRegister()
        .request()
        .expect(302)

      expect(response.headers.location).toBe(redirectUrl)
    })
  })
})

function createServer(port: number, content: string): void {
  const expressApp = express()
  expressApp.get('/', (req, res) => {
    res.send(content)
  })
  expressApp.listen(port).unref()
}
