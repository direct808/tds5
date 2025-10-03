import { Injectable } from '@nestjs/common'
import {
  GetReportArgs,
  ReportRepository,
} from '@/infra/repositories/report.repository'

@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  public async getReport(args: GetReportArgs): Promise<any> {
    return this.reportRepository.getReport(args)
  }
}
