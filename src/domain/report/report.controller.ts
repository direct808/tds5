import { Controller, Get, Query } from '@nestjs/common'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'
import { ReportService } from '@/domain/report/report.service'

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  getReport(@Query() args: any) {
    return this.reportService.getReport(args)
  }
}
