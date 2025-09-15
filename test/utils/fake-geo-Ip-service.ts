import { GeoIpResult, GeoIpService } from '@/domain/geo-ip/types'

export class FakeGeoIpService implements GeoIpService {
  private data: GeoIpResult | undefined

  get(): GeoIpResult | undefined {
    return this.data
  }

  set(data: GeoIpResult): void {
    this.data = data
  }
}
