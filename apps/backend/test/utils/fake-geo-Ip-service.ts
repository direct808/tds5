import { GeoIpResult, GeoIpService } from '../../src/domain/geo-ip/types'

export class FakeGeoIpService implements GeoIpService {
  private data: GeoIpResult | undefined

  public get: GeoIpService['get'] = () => {
    return this.data
  }

  set(data: GeoIpResult): void {
    this.data = data
  }
}
