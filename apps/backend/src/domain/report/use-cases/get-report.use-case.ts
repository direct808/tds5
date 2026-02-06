import { Injectable } from '@nestjs/common'
import { ReportResponse } from '../types'
import { CheckArgsService } from '../services/check-args.service'
import { GetReportDto } from '../dto/get-report.dto'
import { ReportBuilderService } from '../services/report-builder.service'

@Injectable()
export class GetReportUseCase {
  constructor(
    private readonly checkArgsService: CheckArgsService,
    private readonly reportComposeService: ReportBuilderService,
  ) {}

  public async execute(args: GetReportDto): Promise<ReportResponse> {
    this.checkArgsService.checkArgs(args)

    return this.reportComposeService.build(args)
  }
}
