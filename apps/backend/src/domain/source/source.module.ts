import { Module } from '@nestjs/common'
import { SourceController } from './source.controller'
import { SourceService } from './source.service'
import { RepositoryModule } from '@/infra/repositories/repository.module'
import { ListSourceUseCase } from '@/domain/source/use-cases/list-source.use-case'
import { GetSourceColumnsUseCase } from './use-cases/get-source-columns.use-case'
import { GetSourceByIdUseCase } from './use-cases/get-source-by-id.use-case'
import { ReportModule } from '@/domain/report/report.module'

@Module({
  imports: [RepositoryModule, ReportModule],
  controllers: [SourceController],
  providers: [
    SourceService,
    ListSourceUseCase,
    GetSourceColumnsUseCase,
    GetSourceByIdUseCase,
  ],
})
export class SourceModule {}
