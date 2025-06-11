import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configureApp } from './utils/configure-app'
import { AppConfig } from './config/app-config.service'
import { CampaignBuilder } from './utils/entity-builder/campaign-builder'
import {
  StreamActionType,
  StreamRedirectType,
} from './campaign/entity/stream.entity'
import { DataSource } from 'typeorm'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configureApp(app)

  const config = app.get(AppConfig)
  const logger = new Logger()

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TDS 5')
    .setDescription('Трекер веб-аналитики и отслеживания траффика')
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app, documentFactory, { swaggerOptions: {} })

  await app.listen(config.port)
  logger.log('Server is listening on port: ' + config.port)

  // await CampaignBuilder.create()
  //   .name('Test campaign 1')
  //   .code('abcdif')
  //   .userId('7ed0caef-1b85-4d3f-9da6-109aa00a836b')
  //   .addStreamTypeAction((stream) => {
  //     stream
  //       .name('Stream 1')
  //       .type(StreamActionType.TO_CAMPAIGN)
  //       .createActionCampaign((campaign) => {
  //         campaign
  //           .name('Sub campaign')
  //           .userId('7ed0caef-1b85-4d3f-9da6-109aa00a836b')
  //           .code('subCampaign')
  //           .addStreamTypeDirectUrl((stream) => {
  //             stream
  //               .name('s1')
  //               .url('http://localhost:8080')
  //               .redirectType(StreamRedirectType.HTTP)
  //           })
  //       })
  //   })
  //   .save(app.get(DataSource))
}

void bootstrap()
