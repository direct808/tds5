import { Injectable } from '@nestjs/common'
import { ensureDefined } from '../../../shared/helpers'
import { ReportResponse } from '../types'

type EntityItem = {
  id: string
  name: string
}

type RowsMap = Map<string, Record<string, string>>

type Args = {
  report: ReportResponse
  entityList: EntityItem[]
  metrics: string[]
  entityIdName: string
  offset: number
  limit: number
  sortField?: string
  sortOrder?: string
}

@Injectable()
export class ComposeReportService {
  public compose(args: Args): ReportResponse {
    const { entityList, report, metrics, entityIdName } = args
    const rowsConcat = this.concat(
      entityList,
      report.rows,
      metrics,
      entityIdName,
    )
    const rowsSorted = this.applySort(args, rowsConcat)
    const rowsPaginated = this.applyPagination(args, rowsSorted)

    return {
      rows: rowsPaginated,
      summary: report.summary,
      total: entityList.length,
    }
  }

  private concat(
    entityList: EntityItem[],
    rows: Record<string, string>[],
    metrics: string[],
    entityIdName: string,
  ): Record<string, string>[] {
    const rowsMap: RowsMap = new Map(
      rows.map((item) => [ensureDefined(item[entityIdName]), item]),
    )

    return entityList.map((entity) =>
      this.concatItem(entity, rowsMap, metrics, entityIdName),
    )
  }

  private concatItem(
    entity: EntityItem,
    rowsMap: RowsMap,
    metrics: string[],
    entityIdName: string,
  ): Record<string, string> {
    const row = rowsMap.get(entity.id) || this.fillEmptyRow(metrics)
    const { [entityIdName]: _, ...rowWithoutCampaignId } = row

    return { id: entity.id, name: entity.name, ...rowWithoutCampaignId }
  }

  private fillEmptyRow(metrics: string[]): Record<string, string> {
    return metrics.reduce<Record<string, string>>((acc, key) => {
      acc[key] = '0'

      return acc
    }, {})
  }

  private applyPagination(
    args: Args,
    rows: Record<string, string>[],
  ): Record<string, string>[] {
    return rows.slice(args.offset, args.offset + args.limit)
  }

  private applySort(
    { sortField, sortOrder }: Args,
    rows: Record<string, string>[],
  ): Record<string, string>[] {
    if (!sortField) {
      return rows
    }

    return rows.sort((a, b) => {
      const aa = ensureDefined(a[sortField])
      const bb = ensureDefined(b[sortField])

      const [aaa, bbbb] = sortOrder === 'desc' ? [bb, aa] : [aa, bb]

      return aaa.localeCompare(bbbb, undefined, {
        numeric: true,
      })
    })
  }
}
