import { Injectable } from '@nestjs/common'
import {
  InputFilterData,
  ReportRangeEnum,
  ReportResponse,
} from '@/domain/report/types'
import { ComposeReportService } from '@/domain/report/services/compose-report.service'
import { ReportBuilderService } from '@/domain/report/services/report-builder.service'

type HandleArgs = {
  metrics: string[]
  timezone: string
  rangeInterval: ReportRangeEnum
  offset: number
  limit: number
  sortField?: string
  sortOrder?: string
}

type EntityItem = {
  id: string
  name: string
}

@Injectable()
export class EntityReportUseCase {
  constructor(
    private readonly composeReportService: ComposeReportService,
    private readonly reportBuilderService: ReportBuilderService,
  ) {}

  public async execute(
    args: HandleArgs,
    entityList: EntityItem[],
    entityIdName: string,
  ): Promise<ReportResponse> {
    if (entityList.length === 0) {
      return { summary: {}, total: 0, rows: [] }
    }
    const ids = entityList.map((item) => item.id)
    const report = await this.getReport(args, ids, entityIdName)

    return this.composeReportService.compose({
      ...args,
      report,
      entityList,
      entityIdName,
    })
  }

  private async getReport(
    args: HandleArgs,
    ids: string[],
    entityIdName: string,
  ): Promise<ReportResponse> {
    const filter: InputFilterData[] = [[entityIdName, 'in', ids]]

    return this.reportBuilderService.build({
      metrics: args.metrics,
      timezone: args.timezone,
      rangeInterval: args.rangeInterval,
      groups: [entityIdName],
      filter,
      offset: 0,
      limit: 1000,
    })
  }
}
