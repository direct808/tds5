import { Module } from '@nestjs/common'
import { ReportService } from './services/report.service'
import { ReportController } from './report.controller'
import { RepositoryModule } from '../../infra/repositories/repository.module'
import { GetReportUseCase } from './use-cases/get-report.use-case'
import { CheckArgsService } from './services/check-args.service'
import { FilterProcessorService } from './services/filter-processor.service'
import { MetricProcessService } from './services/metric-process.service'
import { EntityReportUseCase } from './use-cases/entity-report-use-case.service'
import { ComposeReportService } from './services/compose-report.service'
import { ReportBuilderService } from './services/report-builder.service'

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
