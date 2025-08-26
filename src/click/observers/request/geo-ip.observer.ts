import { Inject, Injectable } from '@nestjs/common'
import { ClickData } from '@/click/click-data'
import { ClickObserver } from '@/click/observers/subject'
import { ClickContext } from '@/click/shared/click-context.service'
import { GEO_IP_PROVIDER, GeoIpService } from '@/geo-ip/types'

@Injectable()
export class GeoIpObserver implements ClickObserver {
  constructor(
    @Inject(GEO_IP_PROVIDER)
    private readonly geoIpService: GeoIpService,
    private readonly clickContext: ClickContext,
  ) {}

  public handle() {
    const clickData = this.clickContext.getClickData()
    const request = this.clickContext.getRequestAdapter()

    const ip = request.ip

    if (!ip) {
      return
    }

    const geoIpData = this.geoIpService.get(ip)

    if (!geoIpData) {
      return
    }

    Object.assign<ClickData, ClickData>(clickData, geoIpData)
  }
}
