import { DataSource } from 'typeorm'
import { Source } from '../../src/source'
import { sourceFixtures, userFixtures } from '../fixtures'
import { User } from '../../src/user'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'

export async function loadSourceFixtures(ds: DataSource) {
  const repo = ds.getRepository(Source)
  await repo.save(repo.create(sourceFixtures))
}

export async function loadUserFixtures(ds: DataSource) {
  const repo = ds.getRepository(User)
  await repo.save(repo.create(userFixtures))
}

export async function authUser(app: INestApplication) {
  const { body } = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: 'admin@gmail.com', password: '1234' })

  return body.accessToken
}
