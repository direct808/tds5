import { Module } from '@nestjs/common'
import { ReportService } from '@/domain/report/report.service'
import { ReportController } from '@/domain/report/report.controller'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { GetReportUseCase } from '@/domain/report/use-cases/get-report/get-report.use-case'
import { CheckArgsService } from '@/domain/report/use-cases/get-report/check-args.service'

@Module({
  controllers: [ReportController],
  providers: [ReportService, GetReportUseCase, CheckArgsService],
  imports: [RepositoryModule],
})
export class ReportModule {}
