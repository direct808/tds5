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
    const fixed: ColumnResponseDto[] = FIXED_COLUMNS.map((column) => ({
      column,
      name: column,
      default: DEFAULTS.has(column),
    }))

    const metrics: ColumnResponseDto[] =
      this.reportColumnService.getMetricsNames(DEFAULTS)

    return [...fixed, ...metrics]
  }
}
