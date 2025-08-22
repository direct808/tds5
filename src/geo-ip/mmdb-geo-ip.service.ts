import { Injectable } from '@nestjs/common'
import * as fs from 'node:fs'
import { GeoIpResult, GeoIpService } from './types'
import { CityResponse, Reader } from 'mmdb-lib'

@Injectable()
export class MmdbGeoIpService implements GeoIpService {
  private readonly reader: Reader<CityResponse>

  constructor() {
    const db = fs.readFileSync('./geo-ip.mmdb')
    this.reader = new Reader<CityResponse>(db)
  }

  public get(ip: string): GeoIpResult | undefined {
    const result = this.reader.get(ip)
    if (!result) {
      return
    }

    return {
      country: result.country?.iso_code,
      region: result.subdivisions?.[0]?.names.en,
      city: result.city?.names.en,
    }
  }
}
