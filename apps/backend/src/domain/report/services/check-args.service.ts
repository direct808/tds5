import { BadRequestException, Injectable } from '@nestjs/common'
import { ReportService } from './report.service'
import { GetReportDto } from '../dto/get-report.dto'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class CheckArgsService {
  constructor(private readonly reportService: ReportService) {}

  public checkArgs(args: GetReportDto): void {
    this.checkExistOrderField(args.sortField)
    this.checkContainOrderField(args)
  }

  private checkExistOrderField(sortField?: string): void {
    if (isNullable(sortField)) {
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

    if (isNullable(sortField)) {
      return
    }

    if (metrics.includes(sortField)) {
      return
    }

    if (groups.includes(sortField)) {
      return
    }

    throw new BadRequestException(
      `Order field ${sortField} must contain in metrics or group`,
    )
  }
}
