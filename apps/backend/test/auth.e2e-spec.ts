import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { truncateTables } from './utils/truncate-tables'
import { createApp } from './utils/create-app'
import { createAuthUser } from './utils/helpers'
import { UserRepository } from '@/infra/repositories/user.repository'
import { PostbackRequestBuilder } from './utils/postback-request-builder'

const login = 'admin'
const password = '1234'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    await truncateTables()
    app = await createApp()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('/auth/login (POST)', () => {
    it('should return access token for valid credentials', async () => {
      await createAuthUser(app)
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login, password })
        .expect(201)

      expect(response.body).toHaveProperty('accessToken')
    })

    it('should return 401 for invalid credentials', async () => {
      await createAuthUser(app)
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login, password: 'invalid' })
        .expect(401)
    })

    it('should return 401 if user not found', async () => {
      await createAuthUser(app)
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login: 'notfound', password })
        .expect(401)
    })
  })

  describe('Create admin', () => {
    const expectedResponse = {
      error: 'ADMIN_NOT_CREATED',
      message: 'Create the first user to initialize the system',
    }

    it('Should return 428 when login if no users', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ login, password })
        .expect(428)
        .expect(expectedResponse)
    })

    it('Should return 428 when postback if no users', async () => {
      await PostbackRequestBuilder.create(app)
        .subid('subid')
        .request()
        .expect(428)
        .expect(expectedResponse)
    })

    it('Should not return 428 when metrics', async () => {
      await request(app.getHttpServer()).get('/metrics').expect(200)
    })

    it('Should return 400 if user already created', async () => {
      const {
        body: { accessToken },
      } = await request(app.getHttpServer())
        .post('/api/auth/first-user')
        .send({ login, password, confirmPassword: password })
        .expect(201)

      expect(accessToken).toBeDefined()

      await request(app.getHttpServer())
        .post('/api/auth/first-user')
        .send({ login, password: password, confirmPassword: password })
        .expect(400)
        .expect(
          `{"message":"User already created","error":"Bad Request","statusCode":400}`,
        )
    })

    it('should pass', async () => {
      const countFn = jest.spyOn(app.get(UserRepository), 'count')

      await request(app.getHttpServer())
        .get('/api/offer')
        .expect(428)
        .expect(expectedResponse)

      expect(countFn).toHaveBeenCalledTimes(1)

      await request(app.getHttpServer())
        .get('/api/offer')
        .expect(428)
        .expect(expectedResponse)

      expect(countFn).toHaveBeenCalledTimes(1)

      const {
        body: { accessToken },
      } = await request(app.getHttpServer())
        .post('/api/auth/first-user')
        .send({ login, password: password, confirmPassword: password })
        .expect(201)

      await request(app.getHttpServer())
        .post('/api/offer')
        .send({
          name: 'Offer 1',
          url: 'http://google.com',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(201)

      expect(countFn).toHaveBeenCalledTimes(2)

      await request(app.getHttpServer())
        .post('/api/offer')
        .send({
          name: 'Offer 2',
          url: 'http://google.com',
        })
        .auth(accessToken, { type: 'bearer' })
        .expect(201)

      expect(countFn).toHaveBeenCalledTimes(2)
    })
  })
})
