import { Injectable } from '@nestjs/common'
import { ReportResult } from '@/domain/report/types'

@Injectable()
export class ReportService {
  public async getReport(): Promise<any> {}
}
