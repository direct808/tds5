import { Injectable } from '@nestjs/common'
import { ReportResponse } from '@/domain/report/types'
import { CheckArgsService } from '@/domain/report/services/check-args.service'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'
import { ReportBuilderService } from '@/domain/report/services/report-builder.service'

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
