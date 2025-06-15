import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { DataSource, Repository } from 'typeorm'
import {
  authUser,
  loadSourceFixtures,
  loadUserFixtures,
  createTestContainer,
  truncateTables,
} from './utils/helpers'
import { Source } from '../src/source/source.entity'
import { configureApp } from '../src/utils/configure-app'
import { createTestDatabase } from './jest.global-setup'

describe('SourceController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let sourceRepository: Repository<Source>

  beforeAll(async () => {
    // await createTestContainer()
  })

  afterEach(async () => {
    // await truncateTables(app)
  })

  beforeEach(async () => {
    process.env.DB_NAME = await createTestDatabase()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    configureApp(app)
    await app.init()
    const dataSource = app.get(DataSource)
    await loadUserFixtures(dataSource)
    await loadSourceFixtures(dataSource)
    sourceRepository = dataSource.getRepository(Source)
    accessToken = await authUser(app)
  })

  it('Create source', () => {
    return request(app.getHttpServer())
      .post('/api/source')
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'source 1' })
      .expect(201)
  })

  it('List source', () => {
    return (
      request(app.getHttpServer())
        .get('/api/source')
        .auth(accessToken, { type: 'bearer' })
        // .send({ name: 'source 1' })
        .expect(200)
    )
  })

  it('Обновление source, при этом нельзя обновить id у source', async () => {
    await request(app.getHttpServer())
      .patch('/api/source/00000000-0000-4000-8000-000000000001')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const source = await sourceRepository.findOneOrFail({
      where: { id: '00000000-0000-4000-8000-000000000001' },
    })

    expect(source.name).toEqual('updated name')
  })

  it('Delete source', async () => {
    await request(app.getHttpServer())
      .delete('/api/source/00000000-0000-4000-8000-000000000001')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const source = await sourceRepository.findOneBy({
      id: '00000000-0000-4000-8000-000000000001',
    })

    await expect(source).toBeNull()
  })
})
