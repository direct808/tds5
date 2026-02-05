import { Module } from '@nestjs/common'
import { ReportService } from '@/domain/report/services/report.service'
import { ReportController } from '@/domain/report/report.controller'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { GetReportUseCase } from '@/domain/report/use-cases/get-report.use-case'
import { CheckArgsService } from '@/domain/report/services/check-args.service'
import { FilterProcessorService } from '@/domain/report/services/filter-processor.service'
import { MetricProcessService } from '@/domain/report/services/metric-process.service'
import { EntityReportUseCase } from '@/domain/report/use-cases/entity-report-use-case.service'
import { ComposeReportService } from '@/domain/report/services/compose-report.service'
import { ReportBuilderService } from '@/domain/report/services/report-builder.service'

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    GetReportUseCase,
    CheckArgsService,
    FilterProcessorService,
    MetricProcessService,
    EntityReportUseCase,
    ComposeReportService,
    ReportBuilderService,
  ],
  imports: [RepositoryModule],
  exports: [EntityReportUseCase],
})
export class ReportModule {}
