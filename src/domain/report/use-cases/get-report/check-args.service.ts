import { BadRequestException, Injectable } from '@nestjs/common'
import { ReportService } from '@/domain/report/report.service'
import { GetReportArgs } from '@/domain/report/use-cases/get-report/get-report.use-case'

@Injectable()
export class CheckArgsService {
  constructor(private readonly reportService: ReportService) {}

  public checkArgs(args: GetReportArgs): void {
    this.checkExistOrderField(args.sortField)
    this.checkContainOrderField(args)
  }

  private checkExistOrderField(name?: string): void {
    if (!name) {
      return
    }

    if (this.reportService.getAllGroupFieldNames().includes(name)) {
      return
    }

    if (this.reportService.getAllMetricsFieldNames().includes(name)) {
      return
    }

    throw new BadRequestException(`Unknown order fields ${name}`)
  }

  private checkContainOrderField(args: GetReportArgs): void {
    const { sortField, groups, metrics } = args

    if (!sortField) {
      return
    }

    if (metrics && metrics.includes(sortField)) {
      return
    }

    if (groups && groups.includes(sortField)) {
      return
    }

    throw new BadRequestException(
      `Order field ${sortField} must contain in metrics or group`,
    )
  }
}
