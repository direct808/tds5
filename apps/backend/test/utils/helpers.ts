import request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { PrismaService } from '../../src/infra/prisma/prisma.service'

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
