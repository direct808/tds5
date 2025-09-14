import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { SourceModule } from '@/domain/source/source.module'
import { UserModule } from '@/domain/user/user.module'
import { AuthModule } from '@/domain/auth/auth.module'
import { AffiliateNetworkModule } from '@/domain/affiliate-network/affiliate-network.module'
import { OfferModule } from '@/domain/offer/offer.module'
import { CampaignModule } from '@/domain/campaign/campaign.module'
import { ClickModule } from '@/domain/click/click.module'
import { ClsModule } from 'nestjs-cls'
import { GeoIpModule } from '@/domain/geo-ip/geo-ip.module'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AppConfigModule } from '@/infra/config/app-config.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { StartRequestInterceptor } from '@/shared/start-request.interceptor'
import { AppExceptionFilter } from '@/shared/app-exception.filter'

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    SourceModule,
    UserModule,
    AuthModule,
    AffiliateNetworkModule,
    OfferModule,
    CampaignModule,
    ClickModule,
    GeoIpModule,
    EventEmitterModule.forRoot(),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StartRequestInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
