import { Controller, Get, Query } from '@nestjs/common'
import { GetReportUseCase } from '@/domain/report/use-cases/get-report/get-report.use-case'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'
import { inspect } from 'node:util'

@Controller('report')
export class ReportController {
  constructor(private readonly getReportUseCase: GetReportUseCase) {}

  @Get()
  getReport(@Query() args: GetReportDto): any {
    // console.log(inspect(args, false, 5))

    // @ ts-ignore
    return this.getReportUseCase.handle(args)
  }
}
