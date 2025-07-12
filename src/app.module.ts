import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { StartRequestInterceptor } from './start-request.interceptor.js'
import { AppExceptionFilter } from './app-exception.filter.js'
import { AppConfigModule } from './config/app-config.module.js'
import { AppDbModule } from './config/app-db.module.js'
import { SourceModule } from './source/source.module.js'
import { UserModule } from './user/user.module.js'
import { AuthModule } from './auth/auth.module.js'
import { AffiliateNetworkModule } from './affiliate-network/affiliate-network.module.js'
import { OfferModule } from './offer/offer.module.js'
import { CampaignModule } from './campaign/campaign.module.js'
import { ClickModule } from './click/click.module.js'
import { ClsModule } from 'nestjs-cls'

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
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
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
