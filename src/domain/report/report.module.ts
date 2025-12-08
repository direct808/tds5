import { Module } from '@nestjs/common'
import { ReportService } from '@/domain/report/report.service'
import { ReportController } from '@/domain/report/report.controller'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { GetReportUseCase } from '@/domain/report/use-cases/get-report/get-report.use-case'
import { CheckArgsService } from '@/domain/report/use-cases/get-report/check-args.service'
import { FilterProcessorService } from '@/domain/report/use-cases/get-report/filter-processor.service'
import { MetricProcessService } from '@/domain/report/use-cases/get-report/metric-process.service'

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    GetReportUseCase,
    CheckArgsService,
    FilterProcessorService,
    MetricProcessService,
  ],
  imports: [RepositoryModule],
})
export class ReportModule {}
