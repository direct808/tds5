import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '@/app.module'
import { configureApp } from '@/utils/configure-app'
import { createAuthUser, truncateTables } from './utils/helpers'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  afterEach(async () => {
    await truncateTables()
    await app.close()
  })

  beforeEach(async () => {
    app = await createApp()
  })

  describe('/auth/login (POST)', () => {
    it('should return access token for valid credentials', async () => {
      await createAuthUser(app)
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
