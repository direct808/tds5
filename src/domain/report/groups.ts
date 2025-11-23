export type Group = {
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
  country: { filter: 'list' },
  city: { filter: 'list' },
  region: { filter: 'list' },

  adCampaignId: { filter: 'string' },
  campaignId: { filter: 'list' },
  previousCampaignId: { filter: 'list' },
  id: { filter: 'string' },
  offerId: { filter: 'list' },
  affiliateNetworkId: { filter: 'list' },
  sourceId: { filter: 'list' },
  streamId: { filter: 'list' },

  dateTime: {
    filter: 'equals_or_not',
    sql: `to_char(click."createdAt", 'YYYY-MM-DD HH24:MI:SS')`,
  },
  year: { filter: 'numeric', sql: `date_part('year', click."createdAt")` },
  month: { filter: 'string', sql: `to_char(click."createdAt", 'YYYY-MM')` },
  week: { filter: 'numeric', sql: `date_part('week', click."createdAt")` },
  weekday: { filter: 'numeric', sql: `date_part('dow', click."createdAt")` },
  day: { filter: 'string', sql: `to_char(click."createdAt", 'YYYY-MM-DD')` },
  hour: { filter: 'numeric', sql: `date_part('hour', click."createdAt")` },
  dayHour: {
    filter: 'string',
    sql: `to_char(click."createdAt", 'YYYY-MM-DD HH24:00')`,
  },

  // landing
  source: { filter: null, sql: `source.name`, include: 'source' },
  campaign: { filter: null, sql: `campaign.name`, include: 'campaign' },
  stream: { filter: null, sql: `stream.name`, include: 'stream' },
  offer: { filter: null, sql: `offer.name`, include: 'offer' },
  affiliateNetwork: {
    filter: null,
    sql: `affiliateNetwork.name`,
    include: 'affiliateNetwork',
  },

  isUniqueGlobal: { filter: 'boolean' },
  isUniqueCampaign: { filter: 'boolean' },
  isUniqueStream: { filter: 'boolean' },

  destination: { filter: 'string' },
  emptyReferer: { filter: 'boolean', sql: `referer is null` },
  referer: { filter: 'string' },
  keyword: { filter: 'string' },
  visitorId: { filter: 'string' },
  externalId: { filter: 'string' },
  creativeId: { filter: 'string' },

  language: { filter: 'list' },
  isBot: { filter: 'boolean' },
  deviceType: { filter: 'list' },
  deviceModel: { filter: 'list' },
  userAgent: { filter: 'string' },
  os: { filter: 'list' },
  osVersion: { filter: 'string' },
  browser: { filter: 'list' },
  browserVersion: { filter: 'string' },
  ip: { filter: 'ip' },

  isProxy: { filter: 'boolean' },

  subId1: { filter: 'string' },
  subId2: { filter: 'string' },

  ip2: {
    filter: 'string',
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2)`,
  },
  ip3: {
    filter: 'string',
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2) || '.' || split_part(ip::text, '.', 3)`,
  },
}
