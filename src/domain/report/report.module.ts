import { Module } from '@nestjs/common'
import { ReportService } from '@/domain/report/report.service'

@Module({
  providers: [ReportService],
})
export class ReportModule {}
