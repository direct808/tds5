import { ClickMetricMap } from '@/infra/repositories/report.repository'

export type ClickMetricKey = keyof typeof METRICS

export const METRICS = {
  clicks: 'count(click.id)::numeric(12,0)',
  cost: 'coalesce(sum(click.cost), 0)::numeric(12,2)',
  clicks_unique_global:
    'count(click.id) FILTER (WHERE click."isUniqueGlobal")::numeric(12,0)',
  clicks_unique_campaign:
    'count(click.id) FILTER (WHERE click."isUniqueCampaign")::numeric(12,0)',
  clicks_unique_stream:
    'count(click.id) FILTER (WHERE click."isUniqueStream")::numeric(12,0)',
  bots: 'count(click.id) FILTER (WHERE click."isBot")::numeric(12,0)',
  proxies: 'count(click.id) FILTER (WHERE click."isProxy")::numeric(12,0)',
  empty_referer:
    'count(click.id) FILTER (WHERE click."referer" IS NULL)::numeric(12,0)',
} as const satisfies ClickMetricMap

export const METRIC_NAMES: Record<ClickMetricKey, string> = {
  clicks: 'Clicks',
  cost: 'Cost',
  clicks_unique_global: 'Unique Clicks (Global)',
  clicks_unique_campaign: 'Unique Clicks (Campaign)',
  clicks_unique_stream: 'Unique Clicks (Stream)',
  bots: 'Bots',
  proxies: 'Proxies',
  empty_referer: 'Empty Referer',
}
