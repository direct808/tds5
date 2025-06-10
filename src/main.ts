import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configureApp } from './utils/configure-app'
import { AppConfig } from './config/app-config.service'
import { DataSource } from 'typeorm'
import {
  StreamActionType,
  StreamRedirectType,
} from './campaign/entity/stream.entity'
import { CampaignBuilder } from './utils/entity-builder/campaign-builder'

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

  await CampaignBuilder.create()
    .name('Campaign1')
    .code('CODE' + Date.now())
    .userId('7ed0caef-1b85-4d3f-9da6-109aa00a836b')
    .addStreamTypeDirectUrl((stream) => {
      stream.redirectType(StreamRedirectType.META).url('asdasd').name('asdasd') /////
    })
    .addStreamTypeOffers((stream) => {
      stream
        .name('Stream1')
        .addOffer((streamOffer) => {
          streamOffer.percent(50).createOffer((offer) => {
            offer
              .name('Offer 1')
              .url('https://example.com')
              .userId('7ed0caef-1b85-4d3f-9da6-109aa00a836b')
          })
        })
        .addOffer((streamOffer) => {
          streamOffer.percent(50).createOffer((offer) => {
            offer
              .name('Offer 2')
              .url('https://example.com')
              .userId('7ed0caef-1b85-4d3f-9da6-109aa00a836b')
          })
        })
    })
    .addStreamTypeAction((stream) => {
      stream
        .name('Type action')
        .actionType(StreamActionType.TO_CAMPAIGN)
        .createActionCampaign((campaign) => {
          campaign
            .name('Sub campaign')
            .code('asdjkl' + Date.now())
            .userId('7ed0caef-1b85-4d3f-9da6-109aa00a836b')
            .addStreamTypeDirectUrl((stream) => {
              stream
                .name('asdasd')
                .url('http://localhost:8080')
                .redirectType(StreamRedirectType.HTTP)
            })
        })
    })
    .save(app.get(DataSource))
}

void bootstrap()
