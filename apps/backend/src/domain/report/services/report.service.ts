import { Injectable } from '@nestjs/common'
import { FORMULAS } from '@/domain/report/formulas'
import { groups } from '@/domain/report/groups'
import { METRICS } from '@/domain/report/metrics'

@Injectable()
export class ReportService {
  public getAllMetricsFieldCodes(): string[] {
    let result = Object.keys(METRICS)
    result = result.concat(Object.keys(FORMULAS))

    return result
  }

  public getAllGroupFieldNames(): string[] {
    return Object.keys(groups)
  }
}
