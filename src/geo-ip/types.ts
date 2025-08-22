export type GeoIpResult = {
  country?: string
  region?: string
  city?: string
}

export const GEO_IP_PROVIDER = Symbol('GEO_IP_PROVIDER')

export interface GeoIpService {
  get(ip: string): GeoIpResult | undefined
}
