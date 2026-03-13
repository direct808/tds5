import { Injectable } from '@nestjs/common'
import { ColumnResponseDto } from '@/domain/report/dto/column-response.dto'
import { ReportColumnService } from '@/domain/report/services/report-column.service'

const FIXED_COLUMNS = ['affiliateNetworks']
const DEFAULTS = new Set(['clicks', 'roi'])

@Injectable()
export class GetOfferColumnsUseCase {
  constructor(private readonly reportColumnService: ReportColumnService) {}

  public execute(): ColumnResponseDto[] {
    return this.reportColumnService.getColumns(FIXED_COLUMNS, DEFAULTS)
  }
}
