import { Module } from '@nestjs/common'
import { DownloadIp2LocationDatabaseCommand } from './download-ip2-location-database.command'
import { IP2LOCATION_URL } from '@/commands/download-ip2-location-database/tokens'

@Module({
  providers: [
    DownloadIp2LocationDatabaseCommand,
    {
      provide: IP2LOCATION_URL,
      useValue: 'https://www.ip2location.com/download/',
    },
  ],
})
export class DownloadIp2LocationDatabaseModule {}
