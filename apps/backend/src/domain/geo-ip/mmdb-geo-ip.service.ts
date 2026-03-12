import { Injectable } from '@nestjs/common'
import { GeoIpService } from './types'

@Injectable()
export class MmdbGeoIpService implements GeoIpService {
  // private readonly reader: Reader<CityResponse>

  constructor() {
    // const db = fs.readFileSync('./geo-ip.mmdb')
    // this.reader = new Reader<CityResponse>(db)
  }

  public get: GeoIpService['get'] = () => {
    // const result = this.reader.get(ip)
    // if (!result) {
    return undefined
    // }

    // return {
    //   country: result.country?.iso_code,
    //   region: result.subdivisions?.[0]?.names.en,
    //   city: result.city?.names.en,
    // }
  }
}
