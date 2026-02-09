import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configureApp } from './shared/configure-app'
import { AppConfig } from './infra/config/app-config.service'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as fs from 'node:fs'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  configureApp(app)

  const config = app.get(AppConfig)
  const logger = new Logger()

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TDS 5')
    .setDescription('Трекер веб-аналитики и отслеживания трафика')
    .setVersion('1.0')
    .build()
  const documentFactory: () => OpenAPIObject = () =>
    SwaggerModule.createDocument(app, swaggerConfig)

  fs.writeFileSync(
    './swagger.json',
    JSON.stringify(SwaggerModule.createDocument(app, swaggerConfig), null, 2),
  )

  SwaggerModule.setup('api', app, documentFactory, { swaggerOptions: {} })

  await app.listen(config.port)
  logger.log('Server is listening on port: ' + config.port)
}

void bootstrap()
