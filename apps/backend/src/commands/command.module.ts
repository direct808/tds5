import { Module } from '@nestjs/common'
import { DownloadIp2LocationDatabaseModule } from './download-ip2-location-database/download-ip2-location-database.module'
import { GenerateSwaggerModule } from './generate-swagger/generate-swagger.module'
import { AppConfigModule } from '@/infra/config/app-config.module'

@Module({
  imports: [
    AppConfigModule,
    DownloadIp2LocationDatabaseModule,
    GenerateSwaggerModule,
  ],
})
export class CommandModule {}
