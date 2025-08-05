import { configureApp } from '@/utils/configure-app'
import { AppModule } from '@/app.module'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'

export async function createApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()
  const app = moduleFixture.createNestApplication()
  configureApp(app)
  await app.init()
  return app
}
