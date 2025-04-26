import { DataSource } from 'typeorm'
import { Source } from '../../src/source'
import { offerFixtures, sourceFixtures, userFixtures } from '../fixtures'
import { User } from '../../src/user'
import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { Offer } from '../../src/offer'
import { AffiliateNetwork } from '../../src/affiliate-network'
import { affiliateNetworkFixtures } from '../fixtures/affiliate-network.fixture'

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

export async function authUser(app: INestApplication) {
  const { body } = await request(app.getHttpServer())
    .post('/api/auth/login')
    .send({ email: 'admin@gmail.com', password: '1234' })

  return body.accessToken
}
