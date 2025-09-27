type Row = {
  [key: string]: string | number
}

export type ReportResult = {
  rows: Row[]
  summary: Row[]
}
