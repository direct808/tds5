import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { DataSource, Repository } from 'typeorm'
import { authUser, loadUserFixtures, truncateTables } from './utils/helpers'
import { configureApp } from '../src/utils/configure-app'
import { AffiliateNetwork } from '../src/affiliate-network/affiliate-network.entity'
import { AffiliateNetworkBuilder } from '../src/utils/entity-builder/affiliate-network-builder'

describe('AffiliateNetworkController (e2e)', () => {
  let app: INestApplication
  let accessToken: string
  const userId = '00000000-0000-4000-8000-000000000001'
  let affiliateNetworkRepository: Repository<AffiliateNetwork>
  let dataSource: DataSource

  afterEach(async () => {
    await truncateTables(app)
    await app.close()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    configureApp(app)
    await app.init()
    dataSource = app.get(DataSource)
    await loadUserFixtures(dataSource)
    affiliateNetworkRepository = dataSource.getRepository(AffiliateNetwork)
    accessToken = await authUser(app)
  })

  it('Create affiliate network', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/affiliate-network')
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'Network test',
        offerParams: 'OP',
        userId,
        unknownProp: 'Value',
      })
      .expect(201)

    expect(response.body).toEqual({
      id: response.body.id,
      name: 'Network test',
      offerParams: 'OP',
      userId,
      createdAt: response.body.createdAt,
      deletedAt: null,
      updatedAt: response.body.updatedAt,
    })
  })

  it('List Create affiliate network', async () => {
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Af 1')
      .userId(userId)
      .save(dataSource)

    const responce = await request(app.getHttpServer())
      .get('/api/affiliate-network')
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(responce.body[0]).toEqual({
      ...affiliateNetwork,
      createdAt: affiliateNetwork.createdAt.toISOString(),
      updatedAt: affiliateNetwork.updatedAt.toISOString(),
    })
  })

  it('Обновление source, при этом нельзя обновить id у affiliate network', async () => {
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Af 1')
      .userId(userId)
      .save(dataSource)

    await request(app.getHttpServer())
      .patch('/api/affiliate-network/' + affiliateNetwork.id)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'updated name',
        id: '00000000-0000-4000-8000-000000000022',
      })
      .expect(200)

    const anFounded = await affiliateNetworkRepository.findOneOrFail({
      where: { id: affiliateNetwork.id },
    })

    expect(anFounded.name).toEqual('updated name')
  })

  it('Delete affiliate network', async () => {
    const affiliateNetwork = await AffiliateNetworkBuilder.create()
      .name('Af 1')
      .userId(userId)
      .save(dataSource)

    await request(app.getHttpServer())
      .delete('/api/affiliate-network/' + affiliateNetwork.id)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    const deletedSource = await affiliateNetworkRepository.findOneBy({
      id: affiliateNetwork.id,
    })

    expect(deletedSource).toBeNull()
  })
})
