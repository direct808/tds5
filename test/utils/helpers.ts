import { DataSource } from 'typeorm'
import { Source } from '../../src/source'
import {
  affiliateNetworkFixtures,
  campaignFixtures,
  offerFixtures,
  sourceFixtures,
  streamFixtures,
  userFixtures,
} from '../fixtures'
import { User } from '../../src/user'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Offer } from '../../src/offer'
import { AffiliateNetwork } from '../../src/affiliate-network'
import { Campaign, Stream } from '../../src/campaign'
import { PostgreSqlContainer } from '@testcontainers/postgresql'

export async function loadSourceFixtures(ds: DataSource) {
  const repo = ds.getRepository(Source)
  await repo.save(repo.create(sourceFixtures))
}

export async function loadOfferFixtures(ds: DataSource) {
  const repo = ds.getRepository(Offer)
  await repo.save(repo.create(offerFixtures))
}

export async function loadAffiliateNetworkFixtures(ds: DataSource) {
  const repo = ds.getRepository(AffiliateNetwork)
  await repo.save(repo.create(affiliateNetworkFixtures))
}

export async function loadUserFixtures(ds: DataSource) {
  const repo = ds.getRepository(User)
  await repo.save(repo.create(userFixtures))
}

export async function loadCampaignFixtures(ds: DataSource) {
  const repo = ds.getRepository(Campaign)
  await repo.save(repo.create(campaignFixtures))
  await loadStreamFixtures(ds)
}

export async function loadStreamFixtures(ds: DataSource) {
  const repo = ds.getRepository(Stream)
  await repo.save(repo.create(streamFixtures))
}

export async function authUser(app: INestApplication) {
  const { body } = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: 'admin@gmail.com', password: '1234' })

  return body.accessToken
}

export async function truncateTables(app: INestApplication) {
  const ds = app.get(DataSource)
  const tables = await ds.query(
    `SELECT tablename FROM pg_tables where schemaname = 'public'`,
  )
  const names = tables.map((row) => `"${row.tablename}"`).join(', ')
  const sql = `TRUNCATE TABLE ${names} CASCADE;`
  await ds.query(sql)
}

export async function createTestContainer(): Promise<void> {
  const container = await new PostgreSqlContainer().start()

  process.env.DB_HOST = container.getHost()
  process.env.DB_PORT = container.getPort() + ''
  process.env.DB_NAME = container.getDatabase()
  process.env.DB_USER = container.getUsername()
  process.env.DB_PASS = container.getPassword()
}
