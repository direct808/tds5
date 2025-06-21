import { IClick } from './click'

export class ClickData implements Partial<IClick> {
  id?: string
  visitorId?: string
  campaignId?: string
  previousCampaignId?: string
  offerId?: string
  affiliateNetworkId?: string
  trafficSourceId?: string
  streamId?: string
  destination?: string
  // unic
  isUniqueGlobal?: boolean
  isUniqueCampaign?: boolean
  isUniqueStream?: boolean
  // GEO
  isProxy?: boolean
  country?: string
  region?: string
  city?: string
  ip?: string
  createdAt?: Date
  // HEADER INFO
  referer?: string
  userAgent?: string
  language?: string
  // USER AGENT INFO
  isBot?: boolean
  deviceType?: string
  os?: string
  osVersion?: string
  browser?: string
  browserVersion?: string
  deviceModel?: string
  // FROM QUERY STRING
  // из параметров или из referer поисковика
  keyword?: string
  // из параметров или домен из referer
  source?: string
  cost?: number
  externalId?: string
  creativeId?: string
  adCampaignId?: string
  subId1?: string
  subId2?: string
  extraParam1?: string
  extraParam2?: string
}
