import { Injectable } from '@nestjs/common'
import { conversionTypes } from '../../conversion/types'
import { PostgresRawReportQueryBuilder } from './postgres-raw-report-query-builder'
import { RangeProcess } from './range.process'
import {
  ClickMetricMap,
  ReportRepository,
} from '../../../infra/repositories/report.repository'
import { postgresClickMetricMap } from '../postgres-click-metric-map'
import { InjectKysely } from 'nestjs-kysely'
import { DB } from '@generated/kysely'
import { FilterProcessorService } from './filter-processor.service'
import { MetricProcessService } from './metric-process.service'
import { PrismaService } from '../../../infra/prisma/prisma.service'
import { Kysely } from 'kysely'
import { GetReportDto } from '../dto/get-report.dto'
import { groups } from '../groups'
import { Direction, ReportResponse } from '../types'

@Injectable()
export class ReportBuilderService {
  constructor(
    @InjectKysely() private readonly db: Kysely<DB>,
    private readonly reportRepository: ReportRepository,
    private readonly filterProcessorService: FilterProcessorService,
    private readonly metricProcessorService: MetricProcessService,
    private readonly prisma: PrismaService,
  ) {}

  public async build(args: GetReportDto): Promise<ReportResponse> {
    const { usedClickMetrics, clickMetricMap } = this.getClickMetricMapProxy()

    this.reportRepository.addConversionsClickMetrics(
      clickMetricMap,
      Object.keys(conversionTypes),
    )

    const qb = new PostgresRawReportQueryBuilder(
      this.prisma,
      args.timezone,
      Object.keys(conversionTypes),
      usedClickMetrics,
    )

    this.filterProcessorService.process(qb, clickMetricMap, args.filter)
    this.metricProcessorService.process(qb, clickMetricMap, args.metrics)

    const rangeProcess = new RangeProcess({
      qb,
      timezone: args.timezone,
      rangeInterval: args.rangeInterval,
    })

    rangeProcess.process(args.rangeFrom, args.rangeTo)

    this.processGroups(args.groups, qb)

    const { total, summary } = await qb.executeSummary()

    this.processOrder(qb, args.sortField, args.sortOrder)
    qb.setPagination(args.offset, args.limit)

    const rows = total > 0 ? await qb.execute() : []
    // const rows = await qb.execute()

    return { rows, summary, total }
  }

  private getClickMetricMapProxy(): {
    clickMetricMap: ClickMetricMap
    usedClickMetrics: string[]
  } {
    const usedClickMetrics: string[] = []
    const clickMetricMap = new Proxy(postgresClickMetricMap, {
      get(target, key: string): string | undefined {
        usedClickMetrics.push(key)

        return target[key]
      },
    })

    return { clickMetricMap, usedClickMetrics }
  }

  private processGroups(
    groupKeys: string[],
    qb: PostgresRawReportQueryBuilder,
  ): void {
    for (const groupKey of groupKeys) {
      if (!groups[groupKey]) {
        throw new Error('Unknown group key ' + groupKey)
      }

      const { sql: query, table } = groups[groupKey]

      if (query) {
        qb.selectGroupRaw(query, groupKey, table)
        continue
      }

      qb.selectGroup(groupKey, groupKey)
    }
  }

  private processOrder(
    qb: PostgresRawReportQueryBuilder,
    sortField?: string,
    sortOrder: Direction = Direction.asc,
  ): void {
    if (!sortField) {
      return
    }

    qb.orderBy(sortField, sortOrder)
  }
}
