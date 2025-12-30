import { ClickMetricMap } from '@/infra/repositories/report.repository'

export const postgresClickMetricMap: ClickMetricMap = {
  clicks: 'count(*)::numeric(12,0)',
  cost: 'coalesce(sum(click.cost), 0)::numeric(12,2)',
  clicks_unique_global:
    'count(*) FILTER (WHERE click."isUniqueGlobal")::numeric(12,0)',
  clicks_unique_campaign:
    'count(*) FILTER (WHERE click."isUniqueCampaign")::numeric(12,0)',
  clicks_unique_stream:
    'count(*) FILTER (WHERE click."isUniqueStream")::numeric(12,0)',
  bots: 'count(*) FILTER (WHERE click."isBot")::numeric(12,0)',
  proxies: 'count(*) FILTER (WHERE click."isProxy")::numeric(12,0)',
  empty_referer:
    'count(*) FILTER (WHERE click."referer" IS NULL)::numeric(12,0)',
}
