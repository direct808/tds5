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
  user: UserModel
  accessToken: string
}> {
  const login = 'admin'
  const salt = await bcrypt.genSalt(1)
  const pass = await bcrypt.hash('1234', salt)
  const user = await UserBuilder.create()
    .login(login)
    .password(pass)
    .save(app.get(PrismaService))

  const accessToken = await authUser(app, { login, password: '1234' })

  return { user, accessToken }
}

export function spyOn<T extends object>(
  service: T,
  key: string,
): jest.SpyInstance {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jest.spyOn(service, key as any)
}
