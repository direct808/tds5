import { INestApplication } from '@nestjs/common'
import { createAuthUser } from '../utils/helpers'
import { createApp } from '../utils/create-app'
import { flushRedisDb, truncateTables } from '../utils/truncate-tables'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { ClickRequestBuilder } from '../utils/click-builders/click-request-builder'
import { CampaignBuilder } from '../utils/entity-builder/campaign-builder'

describe('Click.domain (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userId: string

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await Promise.all([truncateTables(), flushRedisDb()])

    app = await createApp()
    prisma = app.get(PrismaService)
    const authData = await createAuthUser(app)
    userId = authData.user.id
  })

  it('Click by unknown domain', async () => {
    const [domain1, domain2] = ['test1.com', 'test2.com']
    await CampaignBuilder.createRandomActionContent()
      .userId(userId)
      .addIndexPageDomain((builder) => builder.name(domain1).userId(userId))
      .save(prisma)

    const response = await ClickRequestBuilder.create(app)
      .domain(domain2)
      .request()
      .expect(404)

    expect(response.text).toBe(
      '{"message":"No campaign","error":"Not Found","statusCode":404}',
    )
  })

  it('Click by domain', async () => {
    const domain = 'test.com'
    const content = 'Stream content'
    await CampaignBuilder.createRandomActionContent(content)
      .userId(userId)
      .addIndexPageDomain((builder) => builder.name(domain).userId(userId))
      .save(prisma)

    const response = await ClickRequestBuilder.create(app)
      .domain(domain)
      .request()
      .expect(200)

    expect(response.text).toBe(content)
  })
})
