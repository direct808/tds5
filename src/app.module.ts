import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { StartRequestInterceptor } from './start-request.interceptor'
import { AppExceptionFilter } from './app-exception.filter'
import { AppConfigModule } from './config/app-config.module'
import { AppDbModule } from './config/app-db.module'
import { SourceModule } from './source/source.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { AffiliateNetworkModule } from './affiliate-network/affiliate-network.module'
import { OfferModule } from './offer/offer.module'
import { CampaignModule } from './campaign/campaign.module'
import { ClickModule } from './click/click.module'
import { ClsModule } from 'nestjs-cls'
import { GeoIpModule } from '@/geo-ip/geo-ip.module'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'
import { LoggerModule } from 'nestjs-pino'
import pino from 'pino'
import { LokiOptions } from 'pino-loki'

const transport = pino.transport<LokiOptions>({
  target: 'pino-loki',
  options: {
    batching: true,
    interval: 5,

    host: 'http://localhost:3100',
    // basicAuth: {
    //   username: 'username',
    //   password: 'password',
    // },
  },
})

@Module({
  imports: [
    AppConfigModule,
    AppDbModule,
    SourceModule,
    UserModule,
    AuthModule,
    AffiliateNetworkModule,
    OfferModule,
    CampaignModule,
    ClickModule,
    GeoIpModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        // transport: {
        //   target: 'pino-pretty',
        //   options: {
        //     colorize: true,
        //   },
        // },
      },
    }),
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: StartRequestInterceptor,
    // },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
