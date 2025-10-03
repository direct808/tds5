import { Module } from '@nestjs/common'
import { ReportService } from '@/domain/report/report.service'
import { ReportController } from '@/domain/report/report.controller'
import { RepositoryModule } from '@/infra/repositories/repository.module'

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [RepositoryModule],
})
export class ReportModule {}
