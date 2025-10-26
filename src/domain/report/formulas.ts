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
  cr_sale: {
    formula: 'conversions_sale / clicks * 100',
    decimals: 2,
  },
  cr_deposit: {
    formula: 'conversions_deposit / clicks * 100',
    decimals: 2,
  },
  cr_hold: {
    formula: 'conversions_lead / clicks * 100',
    decimals: 2,
  },
  cr_registration: {
    formula: 'conversions_registration / clicks * 100',
    decimals: 2,
  },
  cr_regs_to_deps: {
    formula: 'conversions_registration / conversions_deposit * 100 ',
    decimals: 2,
  },
  // cpa: {
  //   formula:
  //     'cost / (conversions_lead + conversions_sale + conversions_rejected)',
  //   decimals: 2,
  // },
  // cpc: {
  //   formula: 'cost / clicks',
  //   decimals: 2,
  // },
  // cpl: {
  //   formula: 'cost / conversions_lead',
  //   decimals: 2,
  // },
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
  bots_pct: {
    formula: 'bots / clicks * 100',
  },
  approve_pct: {
    formula:
      '(conversions_sale + conversions_deposit) / (conversions_lead + conversions_registration) * 100',
  },
  epc: {
    formula:
      '(revenue_sale + revenue_deposit + revenue_lead + revenue_registration) / clicks',
    decimals: 2,
  },
  uepc: {
    formula:
      '(revenue_sale + revenue_deposit + revenue_lead + revenue_registration) / clicks_unique_global',
    decimals: 2,
  },
  epc_hold: {
    formula: '(revenue_lead + revenue_registration) / clicks',
    decimals: 2,
  },
  uepc_hold: {
    formula: '(revenue_lead + revenue_registration) / clicks_unique_global',
    decimals: 2,
  },
  epc_confirmed: {
    formula: '(revenue_sale + revenue_deposit) / clicks',
    decimals: 2,
  },
  uepc_confirmed: {
    formula: '(revenue_sale + revenue_deposit) / clicks_unique_global',
    decimals: 2,
  },
}
