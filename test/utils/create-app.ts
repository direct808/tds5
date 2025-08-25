import { configureApp } from '@/utils/configure-app'
import { AppModule } from '@/app.module'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { GEO_IP_PROVIDER } from '@/geo-ip/types'
import { FakeGeoIpService } from './fake-geo-Ip-service'

export async function createApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(GEO_IP_PROVIDER)
    .useClass(FakeGeoIpService)

    .compile()
  const app = moduleFixture.createNestApplication()
  configureApp(app)
  await app.init()

  return app
}
