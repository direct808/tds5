import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserBuilder } from './entity-builder/user-builder'
import { PrismaService } from '../../src/infra/prisma/prisma.service'
import { UserModel } from '@generated/prisma/models/User'

async function authUser(
  app: INestApplication,
  user: { login: string; password: string },
): Promise<string> {
  const { body } = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ login: user.login, password: user.password })
    .expect(201)

  return body.accessToken
}

export async function createAuthUser(app: INestApplication): Promise<{
  user: { id: string }
  accessToken: string
}> {
  const login = 'admin'
  const password = '1234'
  const {
    body: { accessToken },
  } = await request(app.getHttpServer())
    .post('/api/auth/first-user')
    .send({ login, password, confirmPassword: password })
    .expect(201)

  const user = await app.get(PrismaService).user.findFirstOrThrow()

  return { user, accessToken }
}

export function spyOn<T extends object>(
  service: T,
  key: string,
): jest.SpyInstance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jest.spyOn(service, key as any)
}
