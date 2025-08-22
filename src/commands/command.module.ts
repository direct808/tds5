import { Module } from '@nestjs/common'
import { AppConfigModule } from '@/config/app-config.module'
import { DownloadIp2LocationDatabaseModule } from '@/commands/download-ip2-location-database/download-ip2-location-database.module'

@Module({
  imports: [AppConfigModule, DownloadIp2LocationDatabaseModule],
})
export class CommandModule {}
