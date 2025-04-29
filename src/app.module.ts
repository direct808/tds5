import { Module } from '@nestjs/common'
import { SourceModule } from './source'
import { AppConfigModule, AppDbModule } from './config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { StartRequestInterceptor } from './start-request.interceptor'
import { UserModule } from './user'
import { AuthModule } from './auth'
import { AffiliateNetworkModule } from './affiliate-network'
import { OfferModule } from './offer'
import { CampaignModule } from './campaign'

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
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StartRequestInterceptor,
    },
  ],
})
export class AppModule {}
