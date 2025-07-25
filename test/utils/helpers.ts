import { DataSource } from 'typeorm'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Source } from '@/source/source.entity'
import { sourceFixtures } from '../fixtures/source.fixture'
import { offerFixtures } from '../fixtures/offer.fixture'
import { AffiliateNetwork } from '@/affiliate-network/affiliate-network.entity'
import { affiliateNetworkFixtures } from '../fixtures/affiliate-network.fixture'
import { User } from '@/user/user.entity'
import { Offer } from '@/offer/offer.entity'
import { userFixtures } from '../fixtures/user.fixture'
import { Campaign } from '@/campaign/entity/campaign.entity'
import {
  campaignFixtures,
  streamFixtures,
  streamOfferFixtures,
} from '../fixtures/campaign.fixture'
import { StreamOffer } from '@/campaign/entity/stream-offer.entity'
import { Stream } from '@/campaign/entity/stream.entity'

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
  await loadStreamOfferFixtures(ds)
}

async function loadStreamFixtures(ds: DataSource) {
  const repo = ds.getRepository(Stream)
  await repo.save(repo.create(streamFixtures))
}

async function loadStreamOfferFixtures(ds: DataSource) {
  const repo = ds.getRepository(StreamOffer)
  await repo.save(repo.create(streamOfferFixtures))
}

export async function authUser(app: INestApplication) {
  const { body } = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: 'admin@gmail.com', password: '1234' })

  return body.accessToken
}

export async function truncateTables(app: INestApplication) {
  const ds = app.get(DataSource)
  const tables: { tablename: string }[] = await ds.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  )
  const names = tables.map((row) => `"${row.tablename}"`).join(', ')
  const sql = `TRUNCATE TABLE ${names} CASCADE;`
  await ds.query(sql)
}
