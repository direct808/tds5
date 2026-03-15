import { Controller, Get, Query } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetReportUseCase } from './use-cases/get-report.use-case'
import { GetReportColumnsUseCase } from './use-cases/get-report-columns.use-case'
import { GetReportDto } from './dto/get-report.dto'
import { ColumnResponseDto } from './dto/column-response.dto'
import { GLOBAL_PREFIX } from '@/shared/constants'
import { ReportResponseDto } from '@/domain/report/dto/report-response.dto'

@Controller(GLOBAL_PREFIX + 'report')
export class ReportController {
  constructor(
    private readonly getReportUseCase: GetReportUseCase,
    private readonly getReportColumnsUseCase: GetReportColumnsUseCase,
  ) {}

  @Get()
  getReport(@Query() args: GetReportDto): Promise<ReportResponseDto> {
    return this.getReportUseCase.execute(args)
  }

  @Get('columns')
  @ApiResponse({ type: ColumnResponseDto, isArray: true })
  getColumns(): ColumnResponseDto[] {
    return this.getReportColumnsUseCase.execute()
  }
}
