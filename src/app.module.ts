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
