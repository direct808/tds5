type Row = {
  [key: string]: string | number
}

export type ReportResult = {
  rows: Row[]
  summary: Row[]
}

export type Formula = { formula: string; decimals?: number }
export type FormulaRecord = Record<string, Formula>
