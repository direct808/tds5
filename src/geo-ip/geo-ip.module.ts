import { Module } from '@nestjs/common'
import { MmdbGeoIpService } from '@/geo-ip/mmdb-geo-ip.service'
import { GEO_IP_PROVIDER } from '@/geo-ip/types'

@Module({
  providers: [
    {
      provide: GEO_IP_PROVIDER,
      useClass: MmdbGeoIpService,
    },
  ],
  exports: [GEO_IP_PROVIDER],
})
export class GeoIpModule {}
