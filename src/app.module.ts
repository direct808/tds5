import { Module } from '@nestjs/common'
import { SourceModule } from './source'
import { AppConfigModule, AppDbModule } from './config'

@Module({
  imports: [AppConfigModule, AppDbModule, SourceModule],
})
export class AppModule {}
