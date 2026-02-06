import { Module } from '@nestjs/common'
import { SourceController } from './source.controller'
import { SourceService } from './source.service'
import { RepositoryModule } from '../../infra/repositories/repository.module'
import { ListSourceUseCase } from './ues-cases/list-source.use-case'
import { ReportModule } from '../report/report.module'

@Module({
  imports: [RepositoryModule, ReportModule],
  controllers: [SourceController],
  providers: [SourceService, ListSourceUseCase],
})
export class SourceModule {}
