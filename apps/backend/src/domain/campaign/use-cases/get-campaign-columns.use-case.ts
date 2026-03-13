import { Injectable } from '@nestjs/common'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { ReportColumnService } from '@/domain/report/services/report-column.service'

const FIXED_COLUMNS = ['source', 'streams']
const DEFAULTS = new Set([
  'clicks',
  'conversions',
  'cr_sale',
  'revenue',
  'cost',
  'roi',
])

@Injectable()
export class GetCampaignColumnsUseCase {
  constructor(private readonly reportColumnService: ReportColumnService) {}

  public execute(): ColumnResponseDto[] {
    return this.reportColumnService.getColumns(FIXED_COLUMNS, DEFAULTS)
  }
}
