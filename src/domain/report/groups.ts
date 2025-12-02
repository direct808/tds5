import { FilterTypeEnum } from '@/domain/report/types'

export type Group = {
  type: null | FilterTypeEnum
  filter:
    | null
    | 'numeric'
    | 'boolean'
    | 'list'
    | 'string'
    | 'equals_or_not'
    | 'ip'
  sql?: string
  include?: 'source' | 'campaign' | 'stream' | 'offer' | 'affiliateNetwork'
}

type Groups = Record<string, Group>

export const groups: Groups = {
  country: { type: FilterTypeEnum.string, filter: 'list' },
  city: { type: FilterTypeEnum.string, filter: 'list' },
  region: { type: FilterTypeEnum.string, filter: 'list' },

  adCampaignId: { type: FilterTypeEnum.string, filter: FilterTypeEnum.string },
  campaignId: { type: FilterTypeEnum.string, filter: 'list' },
  previousCampaignId: { type: FilterTypeEnum.string, filter: 'list' },
  id: { type: FilterTypeEnum.string, filter: FilterTypeEnum.string },
  offerId: { type: FilterTypeEnum.string, filter: 'list' },
  affiliateNetworkId: { type: FilterTypeEnum.string, filter: 'list' },
  sourceId: { type: FilterTypeEnum.string, filter: 'list' },
  streamId: { type: FilterTypeEnum.string, filter: 'list' },

  dateTime: {
    type: FilterTypeEnum.string,
    filter: 'equals_or_not',
    sql: `to_char(click."createdAt", 'YYYY-MM-DD HH24:MI:SS')`,
  },
  year: {
    type: FilterTypeEnum.numeric,
    filter: 'numeric',
    sql: `date_part('year', click."createdAt")`,
  },
  month: {
    type: FilterTypeEnum.string,
    filter: FilterTypeEnum.string,
    sql: `to_char(click."createdAt", 'YYYY-MM')`,
  },
  week: {
    type: FilterTypeEnum.numeric,
    filter: 'numeric',
    sql: `date_part('week', click."createdAt")`,
  },
  weekday: {
    type: FilterTypeEnum.numeric,
    filter: 'numeric',
    sql: `date_part('dow', click."createdAt")`,
  },
  day: {
    type: FilterTypeEnum.string,
    filter: 'string',
    sql: `to_char(click."createdAt", 'YYYY-MM-DD')`,
  },
  hour: {
    type: FilterTypeEnum.numeric,
    filter: 'numeric',
    sql: `date_part('hour', click."createdAt")`,
  },
  dayHour: {
    type: FilterTypeEnum.string,
    filter: 'string',
    sql: `to_char(click."createdAt", 'YYYY-MM-DD HH24:00')`,
  },

  // landing
  source: { type: null, filter: null, sql: `source.name`, include: 'source' },
  campaign: {
    type: null,
    filter: null,
    sql: `campaign.name`,
    include: 'campaign',
  },
  stream: { type: null, filter: null, sql: `stream.name`, include: 'stream' },
  offer: { type: null, filter: null, sql: `offer.name`, include: 'offer' },
  affiliateNetwork: {
    type: null,
    filter: null,
    sql: `affiliateNetwork.name`,
    include: 'affiliateNetwork',
  },

  isUniqueGlobal: { type: FilterTypeEnum.boolean, filter: 'boolean' },
  isUniqueCampaign: { type: FilterTypeEnum.boolean, filter: 'boolean' },
  isUniqueStream: { type: FilterTypeEnum.boolean, filter: 'boolean' },

  destination: { type: FilterTypeEnum.string, filter: 'string' },
  emptyReferer: {
    type: FilterTypeEnum.boolean,
    filter: 'boolean',
    sql: `referer is null`,
  },
  referer: { type: FilterTypeEnum.string, filter: 'string' },
  keyword: { type: FilterTypeEnum.string, filter: 'string' },
  visitorId: { type: FilterTypeEnum.string, filter: 'string' },
  externalId: { type: FilterTypeEnum.string, filter: 'string' },
  creativeId: { type: FilterTypeEnum.string, filter: 'string' },

  language: { type: FilterTypeEnum.string, filter: 'list' },
  isBot: { type: FilterTypeEnum.boolean, filter: 'boolean' },
  deviceType: { type: FilterTypeEnum.string, filter: 'list' },
  deviceModel: { type: FilterTypeEnum.string, filter: 'list' },
  userAgent: { type: FilterTypeEnum.string, filter: 'string' },
  os: { type: FilterTypeEnum.string, filter: 'list' },
  osVersion: { type: FilterTypeEnum.string, filter: 'string' },
  browser: { type: FilterTypeEnum.string, filter: 'list' },
  browserVersion: { type: FilterTypeEnum.string, filter: 'string' },
  ip: { type: FilterTypeEnum.ip, filter: 'ip' },

  isProxy: { type: FilterTypeEnum.boolean, filter: 'boolean' },

  subId1: { type: FilterTypeEnum.string, filter: 'string' },
  subId2: { type: FilterTypeEnum.string, filter: 'string' },

  ip2: {
    type: FilterTypeEnum.string,
    filter: 'string',
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2)`,
  },
  ip3: {
    type: FilterTypeEnum.string,
    filter: 'string',
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2) || '.' || split_part(ip::text, '.', 3)`,
  },
}
