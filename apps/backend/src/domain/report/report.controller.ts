import { Controller, Get, Query } from '@nestjs/common'
import { GetReportUseCase } from './use-cases/get-report.use-case'
import { GetReportDto } from './dto/get-report.dto'
import { GLOBAL_PREFIX } from '../../shared/constants'
import { ReportResponse } from './types'

@Controller(GLOBAL_PREFIX + 'report')
export class ReportController {
  constructor(private readonly getReportUseCase: GetReportUseCase) {}

  @Get()
  getReport(@Query() args: GetReportDto): Promise<ReportResponse> {
    return this.getReportUseCase.execute(args)
  }
}
