import { Injectable } from '@nestjs/common'
import { formulas } from '@/domain/report/formulas'
import { ReportRepository } from '@/infra/repositories/report.repository'

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  public getAllMetrics(): string[] {
    let result = Object.keys(this.reportRepository.getIdentifierMap())
    result = result.concat(Object.keys(formulas))

    return result
  }
}
