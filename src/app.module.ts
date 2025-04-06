import { Module } from '@nestjs/common'
import { SourceModule } from './source'
import { AppConfigModule, AppDbModule } from './config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { StartRequestInterceptor } from './start-request.interceptor'

@Module({
  imports: [AppConfigModule, AppDbModule, SourceModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StartRequestInterceptor,
    },
  ],
})
export class AppModule {}
