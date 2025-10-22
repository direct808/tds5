import type { FormulaRecord } from '@/domain/report/types'

export const formulas: FormulaRecord = {
  revenue: {
    formula:
      'revenue_sale + revenue_deposit + revenue_lead + revenue_registration',
    decimals: 2,
  },
  conversions: {
    formula:
      'conversions_sale + conversions_lead + conversions_registration + deposits',
  },
  deposits: {
    formula: 'conversions_deposit',
  },
  cr: {
    formula: 'conversions / clicks * 100',
    decimals: 2,
  },
  cpa: {
    formula:
      'cost / (conversions_lead + conversions_sale + conversions_rejected)',
    decimals: 2,
  },
  cpc: {
    formula: 'cost / clicks',
    decimals: 2,
  },
  cpl: {
    formula: 'cost / conversions_lead',
    decimals: 2,
  },
  cr_regs_to_deps: {
    formula: 'conversions_registration / conversions_deposit * 100 ',
    decimals: 2,
  },
  roi: {
    formula: '(revenue - cost) / cost * 100',
    decimals: 2,
  },
  roi_confirmed: {
    formula: '((revenue_sale + revenue_deposit) - cost) / cost * 100',
    decimals: 2,
  },
  profit_loss: {
    formula: 'revenue / cost',
    decimals: 2,
  },
  profit_loss_confirmed: {
    formula: '(revenue_sale + revenue_deposit) / cost',
    decimals: 2,
  },
  clicks_unique_global_pct: {
    formula: 'clicks_unique_global / clicks * 100',
  },
  clicks_unique_campaign_pct: {
    formula: 'clicks_unique_campaign / clicks * 100',
  },
  clicks_unique_stream_pct: {
    formula: 'clicks_unique_stream / clicks * 100',
  },
}
