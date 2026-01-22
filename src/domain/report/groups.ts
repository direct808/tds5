import { FilterTypeEnum, QueryTablesEnum } from '@/domain/report/types'

export type Group = {
  type: FilterTypeEnum
  disableFilter?: true
  sql?: string
  table?: QueryTablesEnum
}

type Groups = Record<string, Group>

const atTimeZone = "at time zone 'UTC' at time zone :timezone"

export const groups: Groups = {
  country: { type: FilterTypeEnum.string },
  city: { type: FilterTypeEnum.string },
  region: { type: FilterTypeEnum.string },

  adCampaignId: { type: FilterTypeEnum.string },
  campaignId: { type: FilterTypeEnum.string },
  previousCampaignId: { type: FilterTypeEnum.string },
  id: { type: FilterTypeEnum.string },
  offerId: { type: FilterTypeEnum.string },
  affiliateNetworkId: { type: FilterTypeEnum.string },
  sourceId: { type: FilterTypeEnum.string },
  streamId: { type: FilterTypeEnum.string },

  dateTime: {
    type: FilterTypeEnum.string,
    sql: `to_char(click."createdAt" ${atTimeZone}, 'YYYY-MM-DD HH24:MI:SS')`,
  },
  year: {
    type: FilterTypeEnum.number,

    sql: `date_part('year', click."createdAt" ${atTimeZone})`,
  },
  month: {
    type: FilterTypeEnum.string,
    sql: `to_char(click."createdAt" ${atTimeZone}, 'YYYY-MM')`,
  },
  week: {
    type: FilterTypeEnum.number,

    sql: `date_part('week', click."createdAt" ${atTimeZone})`,
  },
  weekday: {
    type: FilterTypeEnum.number,

    sql: `date_part('dow', click."createdAt" ${atTimeZone})`,
  },
  day: {
    type: FilterTypeEnum.string,
    sql: `to_char(click."createdAt" ${atTimeZone}, 'YYYY-MM-DD')`,
  },
  hour: {
    type: FilterTypeEnum.number,

    sql: `date_part('hour', click."createdAt" ${atTimeZone})`,
  },
  dayHour: {
    type: FilterTypeEnum.string,
    sql: `to_char(click."createdAt" ${atTimeZone}, 'YYYY-MM-DD HH24:00')`,
  },

  sourceName: {
    type: FilterTypeEnum.string,
    disableFilter: true,
    sql: `"source".name`,
    table: QueryTablesEnum.source,
  },
  campaignName: {
    type: FilterTypeEnum.string,
    disableFilter: true,
    sql: `campaign.name`,
    table: QueryTablesEnum.campaign,
  },
  streamName: {
    type: FilterTypeEnum.string,
    disableFilter: true,
    sql: `stream.name`,
    table: QueryTablesEnum.stream,
  },
  offerName: {
    type: FilterTypeEnum.string,
    disableFilter: true,
    sql: `offer.name`,
    table: QueryTablesEnum.offer,
  },
  affiliateNetworkName: {
    type: FilterTypeEnum.string,
    disableFilter: true,
    sql: `"affiliateNetwork".name`,
    table: QueryTablesEnum.affiliateNetwork,
  },

  isUniqueGlobal: { type: FilterTypeEnum.boolean },
  isUniqueCampaign: { type: FilterTypeEnum.boolean },
  isUniqueStream: { type: FilterTypeEnum.boolean },

  destination: { type: FilterTypeEnum.string },
  emptyReferer: {
    type: FilterTypeEnum.boolean,
    sql: `referer is null`,
  },
  referer: { type: FilterTypeEnum.string },
  keyword: { type: FilterTypeEnum.string },
  visitorId: { type: FilterTypeEnum.string },
  externalId: { type: FilterTypeEnum.string },
  creativeId: { type: FilterTypeEnum.string },

  language: { type: FilterTypeEnum.string },
  isBot: { type: FilterTypeEnum.boolean },
  deviceType: { type: FilterTypeEnum.string },
  deviceModel: { type: FilterTypeEnum.string },
  userAgent: { type: FilterTypeEnum.string },
  os: { type: FilterTypeEnum.string },
  osVersion: { type: FilterTypeEnum.string },
  browser: { type: FilterTypeEnum.string },
  browserVersion: { type: FilterTypeEnum.string },
  ip: { type: FilterTypeEnum.ip },

  isProxy: { type: FilterTypeEnum.boolean },

  subId1: { type: FilterTypeEnum.string },
  subId2: { type: FilterTypeEnum.string },

  ip2: {
    type: FilterTypeEnum.string,
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2)`,
  },
  ip3: {
    type: FilterTypeEnum.string,
    sql: `split_part(ip::text, '.', 1) || '.' || split_part(ip::text, '.', 2) || '.' || split_part(ip::text, '.', 3)`,
  },
}
