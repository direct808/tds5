import 'source-map-support/register'
import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module'
import { configureApp } from './shared/configure-app'
import { configureSwagger } from './shared/configure-swagger'
import { AppConfig } from './infra/config/app-config.service'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  configureApp(app)
  configureSwagger(app)

  const config = app.get(AppConfig)
  const logger = new Logger()

  await app.listen(config.port)
  logger.log('Server is listening on port: ' + config.port)
}

void bootstrap()
