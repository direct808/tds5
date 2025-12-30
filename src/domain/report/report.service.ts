import { Injectable } from '@nestjs/common'
import { formulas } from '@/domain/report/formulas'
import { ReportRepository } from '@/infra/repositories/report.repository'
import { groups } from '@/domain/report/groups'
import { postgresClickMetricMap } from '@/domain/report/use-cases/get-report/postgres-click-metric-map'

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  public getAllMetricsFieldNames(): string[] {
    let result = Object.keys(postgresClickMetricMap)
    result = result.concat(Object.keys(formulas))

    return result
  }

  public getAllGroupFieldNames(): string[] {
    return Object.keys(groups)
  }
}
