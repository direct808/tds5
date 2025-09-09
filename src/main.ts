import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configureApp } from './utils/configure-app'
import { AppConfig } from './config/app-config.service'
import { Logger } from 'nestjs-pino'
import pino from 'pino'
import { window } from 'rxjs'

// const transport = pino.transport({
//   target: 'pino-loki',
//   options: {
//     batching: true,
//     interval: 5,
//     host: 'http://localhost:3100',
//     labels: { app: 'nest-service' },
//   },
// })
//
// export const logger = pino(transport)

// setInterval(function () {
//   logger.info('11111111111111111111111111111111111111111111111111111111')
// }, 50)

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true })
  configureApp(app)

  const logger = app.get(Logger)
  app.useLogger(logger)

  const config = app.get(AppConfig)

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TDS 5')
    .setDescription('Трекер веб-аналитики и отслеживания траффика')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, documentFactory, { swaggerOptions: {} })

  await app.listen(config.port)
  logger.log('Server is listening on port: ' + config.port)
}

void bootstrap()
