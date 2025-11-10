type Groups = Record<
  string,
  {
    sql?: string
    include?: 'source' | 'campaign' | 'stream' | 'offer' | 'affiliateNetwork'
  }
>

export const groups: Groups = {
  country: {},
  city: {},
  region: {},

  adCampaignId: {},
  campaignId: {},
  previousCampaignId: {},
  id: {},
  offerId: {},
  affiliateNetworkId: {},
  sourceId: {},
  streamId: {},

  dateTime: { sql: `to_char(click."createdAt", 'YYYY-MM-DD HH24:MI:SS')` },
  year: { sql: `date_part('year', click."createdAt")` },
  month: { sql: `to_char(click."createdAt", 'YYYY-MM')` },
  week: { sql: `date_part('week', click."createdAt")` },
  weekday: { sql: `date_part('dow', click."createdAt")` },
  day: { sql: `to_char(click."createdAt", 'YYYY-MM-DD')` },
  hour: { sql: `date_part('hour', click."createdAt")` },
  dayHour: { sql: `to_char(click."createdAt", 'YYYY-MM-DD HH24:00')` },

  // landing
  source: { sql: `source.name`, include: 'source' },
  campaign: { sql: `campaign.name`, include: 'campaign' },
  stream: { sql: `stream.name`, include: 'stream' },
  offer: { sql: `offer.name`, include: 'offer' },
  affiliateNetwork: {
    sql: `affiliateNetwork.name`,
    include: 'affiliateNetwork',
  },

  isUniqueGlobal: {},
  isUniqueCampaign: {},
  isUniqueStream: {},

  destination: {},
  emptyReferer: { sql: `referer is null` },
  referer: {},
  keyword: {},
  visitorId: {},
  externalId: {},
  creativeId: {},

  language: {},
  isBot: {},
  deviceType: {},
  deviceModel: {},
  userAgent: {},
  os: {},
  osVersion: {},
  browser: {},
  browserVersion: {},
  ip: {},

  isProxy: {},

  subId1: {},
  subId2: {},

  ip2: {
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2)`,
  },
  ip3: {
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2) || '.' || split_part(ip::text, '.', 3)`,
  },
}
