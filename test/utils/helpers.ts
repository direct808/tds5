import { DataSource } from 'typeorm'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UserBuilder } from '@/utils/entity-builder/user-builder'

async function authUser(
  app: INestApplication,
  user: { email: string; password: string },
) {
  const { body } = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: user.email, password: user.password })
    .expect(201)

  return body.accessToken
}

export async function truncateTables(app: INestApplication) {
  const ds = app.get(DataSource)
  const tables: { tablename: string }[] = await ds.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  )
  if (tables.length === 0) {
    return
  }
  const names = tables.map((row) => `"${row.tablename}"`).join(', ')
  const sql = `TRUNCATE TABLE ${names} CASCADE;`
  await ds.query(sql)
}

export async function createAuthUser(app: INestApplication) {
  const email = 'admin@gmail.com'
  const salt = await bcrypt.genSalt(10)
  const pass = await bcrypt.hash('1234', salt)
  const user = await UserBuilder.create()
    .email(email)
    .password(pass)
    .save(app.get(DataSource))

  const accessToken = await authUser(app, { email, password: '1234' })

  return { user, accessToken }
}
