import { Controller, Get, Query } from '@nestjs/common'
import { GetReportUseCase } from '@/domain/report/use-cases/get-report.use-case'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'

@Controller('report')
export class ReportController {
  constructor(private readonly getReportUseCase: GetReportUseCase) {}

  @Get()
  getReport(@Query() args: GetReportDto): any {
    return this.getReportUseCase.handle(args)
  }
}
