import { FormulaRecord, FormulaSummaryEnum } from './types'

export type FormulaKey = keyof typeof FORMULAS

export const FORMULAS = {
  revenue: {
    formula:
      'revenue_sale + revenue_deposit + revenue_lead + revenue_registration',
    summary: FormulaSummaryEnum.sum,
    decimals: 2,
  },
  conversions: {
    formula:
      'conversions_sale + conversions_lead + conversions_registration + conversions_deposit',
    summary: FormulaSummaryEnum.sum,
  },
  cr: {
    formula: 'conversions / clicks * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cr_sale: {
    formula: 'conversions_sale / clicks * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cr_deposit: {
    formula: 'conversions_deposit / clicks * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cr_hold: {
    formula: 'conversions_lead / clicks * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cr_registration: {
    formula: 'conversions_registration / clicks * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cr_regs_to_deps: {
    formula: 'conversions_registration / conversions_deposit * 100 ',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  roi: {
    formula: '(revenue - cost) / cost * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  roi_confirmed: {
    formula: '((revenue_sale + revenue_deposit) - cost) / cost * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  profit_loss: {
    formula: 'revenue / cost',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  profit_loss_confirmed: {
    formula: '(revenue_sale + revenue_deposit) / cost',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  clicks_unique_global_pct: {
    formula: 'clicks_unique_global / clicks * 100',
    summary: FormulaSummaryEnum.avg,
  },
  clicks_unique_campaign_pct: {
    formula: 'clicks_unique_campaign / clicks * 100',
    summary: FormulaSummaryEnum.avg,
  },
  clicks_unique_stream_pct: {
    formula: 'clicks_unique_stream / clicks * 100',
    summary: FormulaSummaryEnum.avg,
  },
  bots_pct: {
    formula: 'bots / clicks * 100',
    summary: FormulaSummaryEnum.avg,
  },
  approve_pct: {
    formula:
      '(conversions_sale + conversions_deposit) / (conversions_lead + conversions_registration) * 100',
    summary: FormulaSummaryEnum.avg,
  },
  epc: {
    formula:
      '(revenue_sale + revenue_deposit + revenue_lead + revenue_registration) / clicks',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  uepc: {
    formula:
      '(revenue_sale + revenue_deposit + revenue_lead + revenue_registration) / clicks_unique_global',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  epc_hold: {
    formula: '(revenue_lead + revenue_registration) / clicks',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  uepc_hold: {
    formula: '(revenue_lead + revenue_registration) / clicks_unique_global',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  epc_confirmed: {
    formula: '(revenue_sale + revenue_deposit) / clicks',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  uepc_confirmed: {
    formula: '(revenue_sale + revenue_deposit) / clicks_unique_global',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cps: {
    formula: 'cost / conversions_sale',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cpl: {
    formula: 'cost / conversions_lead',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cpr: {
    formula: 'cost / conversions_registration',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cpd: {
    formula: 'cost / conversions_deposit',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cpa: {
    formula:
      'cost / (conversions_lead + conversions_sale + conversions_rejected)',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  cpc: {
    formula: 'cost / clicks',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  ucpc: {
    formula: 'cost / clicks_unique_global',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  ecpc: {
    formula: 'cpc * 1000',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  ecpm: {
    formula:
      '(revenue_sale + revenue_lead + revenue_registration + revenue_deposit) / clicks * 1000',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  ecpm_confirmed: {
    formula: '(revenue_sale + revenue_deposit) / clicks * 1000',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
  ucr: {
    formula: 'conversions_registration / clicks_unique_global * 100',
    summary: FormulaSummaryEnum.avg,
    decimals: 2,
  },
} as const satisfies FormulaRecord

export const FORMULA_NAMES: Record<FormulaKey, string> = {
  revenue: 'Revenue',
  conversions: 'Conversions',
  cr: 'CR %',
  cr_sale: 'CR Sale %',
  cr_deposit: 'CR Deposit %',
  cr_hold: 'CR Hold %',
  cr_registration: 'CR Registration %',
  cr_regs_to_deps: 'Regs to Deps %',
  roi: 'ROI %',
  roi_confirmed: 'ROI Confirmed %',
  profit_loss: 'Profit/Loss',
  profit_loss_confirmed: 'Profit/Loss Confirmed',
  clicks_unique_global_pct: 'Unique Global %',
  clicks_unique_campaign_pct: 'Unique Campaign %',
  clicks_unique_stream_pct: 'Unique Stream %',
  bots_pct: 'Bots %',
  approve_pct: 'Approve %',
  epc: 'EPC',
  uepc: 'uEPC',
  epc_hold: 'EPC Hold',
  uepc_hold: 'uEPC Hold',
  epc_confirmed: 'EPC Confirmed',
  uepc_confirmed: 'uEPC Confirmed',
  cps: 'CPS',
  cpl: 'CPL',
  cpr: 'CPR',
  cpd: 'CPD',
  cpa: 'CPA',
  cpc: 'CPC',
  ucpc: 'uCPC',
  ecpc: 'eCPC',
  ecpm: 'eCPM',
  ecpm_confirmed: 'eCPM Confirmed',
  ucr: 'uCR %',
}
