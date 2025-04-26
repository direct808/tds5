import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { DataSource } from 'typeorm'
import {
  createTestDataSource,
  loadSourceFixtures,
  loadUserFixtures,
} from './utils'
import { configureApp } from '../src/utils/configure-app'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    await createTestDataSource()
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    configureApp(app)
    await app.init()
    const dataSource = app.get(DataSource)
    await loadUserFixtures(dataSource)
    await loadSourceFixtures(dataSource)
  })

  describe('/auth/login (POST)', () => {
    it('should return access token for valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@gmail.com', password: '1234' })
        .expect(201)

      expect(response.body).toHaveProperty('accessToken')
    })

    it('should return 401 for invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'admin@gmail.com', password: 'invalid' })
        .expect(401)
    })

    it('should return 401 if user not found', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'notfound@example.com', password: '1234' })
        .expect(401)
    })
  })
})
