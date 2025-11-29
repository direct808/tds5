import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserBuilder } from './entity-builder/user-builder'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { UserModel } from '../../generated/prisma/models/User'

async function authUser(
  app: INestApplication,
  user: { email: string; password: string },
): Promise<string> {
  const { body } = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: user.email, password: user.password })
    .expect(201)

  return body.accessToken
}

export async function createAuthUser(app: INestApplication): Promise<{
  user: UserModel
  accessToken: string
}> {
  const email = 'admin@gmail.com'
  const salt = await bcrypt.genSalt(1)
  const pass = await bcrypt.hash('1234', salt)
  const user = await UserBuilder.create()
    .email(email)
    .password(pass)
    .save(app.get(PrismaService))

  const accessToken = await authUser(app, { email, password: '1234' })

  return { user, accessToken }
}

export function spyOn<T extends object>(
  service: T,
  key: string,
): jest.SpyInstance {
  return jest.spyOn(service, key as any)
}

export function mockWrap(method: (...args: any[]) => any): jest.Mock {
  return method as jest.Mock
}
