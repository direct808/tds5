import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DataSource, Repository } from 'typeorm'
import { createAuthUser } from './utils/helpers'
import { Source } from '@/source/source.entity'
import { SourceBuilder } from './utils/entity-builder/source-builder'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'

describe('SourceController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let userId: string
  let sourceRepository: Repository<Source>
  let dataSource: DataSource

  afterEach(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await truncateTables()
    app = await createApp()
    dataSource = app.get(DataSource)
    sourceRepository = dataSource.getRepository(Source)
    const authData = await createAuthUser(app)
    accessToken = authData.accessToken
    userId = authData.user.id
  })

  it('Create source', async () => {
    await request(app.getHttpServer())
      .post('/api/source')
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'Source 1' })
      .expect(201)

    const source = await sourceRepository.findOne({
      where: { name: 'Source 1' },
    })

    expect(source).not.toBeNull()
  })

  it('List source', async () => {
    await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(dataSource)

    const { body } = await request(app.getHttpServer())
      .get('/api/source')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBe(1)
  })

  it('Обновление source, при этом нельзя обновить id', async () => {
    const source = await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(dataSource)

    await request(app.getHttpServer())
      .patch('/api/source/' + source.id)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const sourceExists = await sourceRepository.findOneOrFail({
      where: { id: source.id },
    })

    expect(sourceExists.name).toEqual('updated name')
  })

  it('Delete source', async () => {
    const source = await SourceBuilder.create()
      .name('Source 1')
      .userId(userId)
      .save(dataSource)

    await request(app.getHttpServer())
      .delete('/api/source/' + source.id)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const sourceExists = await sourceRepository.findOneBy({
      id: source.id,
    })

    expect(sourceExists).toBeNull()
  })
})
