import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { createTestDataSource } from './setup-postgres'
import { AppModule } from '../src/app.module'
import { DataSource, Repository } from 'typeorm'
import { authUser, loadSourceFixtures, loadUserFixtures } from './utils'
import { Source } from '../src/source'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  let sourceRepository: Repository<Source>

  beforeEach(async () => {
    await createTestDataSource()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
    const dataSource = app.get(DataSource)
    await loadUserFixtures(dataSource)
    await loadSourceFixtures(dataSource)
    sourceRepository = dataSource.getRepository(Source)
    accessToken = await authUser(app)
  })

  it('Create source', () => {
    return request(app.getHttpServer())
      .post('/source')
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'source 1' })
      .expect(201)
  })

  it('List source', () => {
    return (
      request(app.getHttpServer())
        .get('/source')
        .auth(accessToken, { type: 'bearer' })
        // .send({ name: 'source 1' })
        .expect(200)
    )
  })

  it('Update source', async () => {
    await request(app.getHttpServer())
      .patch('/source/00000000-0000-0000-0000-000000000001')
      .auth(accessToken, { type: 'bearer' })
      .send({ name: 'updated name' })
      .expect(200)

    const source = await sourceRepository.findOneOrFail({
      where: { id: '00000000-0000-0000-0000-000000000001' },
    })

    expect(source.name).toEqual('updated name')
  })

  it('Delete source', async () => {
    await request(app.getHttpServer())
      .delete('/source/00000000-0000-0000-0000-000000000001')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const source = sourceRepository.findOneOrFail({
      where: { id: '00000000-0000-0000-0000-000000000001' },
    })

    await expect(source).rejects.toThrow()
  })
})
