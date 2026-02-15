import { Inject, Injectable } from '@nestjs/common'
import { ClickData } from '../../click-data'
import { ClickObserver } from '../subject'
import { ClickContext } from '../../shared/click-context.service'
import { GEO_IP_PROVIDER, GeoIpService } from '../../../geo-ip/types'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class GeoIpObserver implements ClickObserver {
  constructor(
    @Inject(GEO_IP_PROVIDER)
    private readonly geoIpService: GeoIpService,
    private readonly clickContext: ClickContext,
  ) {}

  public handle(): void {
    const clickData = this.clickContext.getClickData()
    const request = this.clickContext.getRequestAdapter()

    const ip = request.ip

    if (isNullable(ip)) {
      return
    }

    const geoIpData = this.geoIpService.get(ip) as ClickData

    if (isNullable(geoIpData)) {
      return
    }

    Object.assign<ClickData, ClickData>(clickData, geoIpData)
  }
}
