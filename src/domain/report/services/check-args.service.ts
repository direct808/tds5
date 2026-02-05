import { BadRequestException, Injectable } from '@nestjs/common'
import { ReportService } from '@/domain/report/services/report.service'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'

@Injectable()
export class CheckArgsService {
  constructor(private readonly reportService: ReportService) {}

  public checkArgs(args: GetReportDto): void {
    this.checkExistOrderField(args.sortField)
    this.checkContainOrderField(args)
  }

  private checkExistOrderField(sortField?: string): void {
    if (!sortField) {
      return
    }

    if (this.reportService.getAllGroupFieldNames().includes(sortField)) {
      return
    }

    if (this.reportService.getAllMetricsFieldNames().includes(sortField)) {
      return
    }

    throw new BadRequestException(`Unknown order fields ${sortField}`)
  }

  private checkContainOrderField(args: GetReportDto): void {
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
