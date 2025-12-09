import { Controller, Get, Query } from '@nestjs/common'
import { GetReportUseCase } from '@/domain/report/use-cases/get-report/get-report.use-case'
import { GetReportDto } from '@/domain/report/dto/get-report.dto'
import { CurrentUserEmail } from '@/infra/auth/current-user-email.decorator'

@Controller('report')
export class ReportController {
  constructor(private readonly getReportUseCase: GetReportUseCase) {}

  @Get()
  getReport(
    @Query() args: GetReportDto,
    @CurrentUserEmail() userEmail: string,
  ): Promise<Record<string, string | number>> {
    return this.getReportUseCase.handle(args, userEmail)
  }
}
