import { Injectable } from '@nestjs/common'
import { conversionTypes } from '@/domain/conversion/types'
import { ReportQueryBuilder } from '@/domain/report/report-query-builder'
import {
  IdentifierMap,
  ReportRepository,
} from '@/infra/repositories/report.repository'
import { groups } from '@/domain/report/groups'
import { formulas } from '@/domain/report/formulas'
import { FormulaParser } from '@/domain/report/formula-parser'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely } from 'kysely'
import { DB } from '@/shared/db'
import { Direction } from '@/domain/report/types'
import { CheckArgsService } from '@/domain/report/use-cases/get-report/check-args.service'

export type GetReportArgs = {
  metrics: string[]
  groups: string[]
  sortField?: string
  sortOrder?: Direction
}

@Injectable()
export class GetReportUseCase {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly checkArgsService: CheckArgsService,
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  public async handle(args: GetReportArgs): Promise<any> {
    this.checkArgsService.checkArgs(args)

    const { usedIdentifiers, identifierMap } = this.getIdentifierMapProxy()

    await this.reportRepository.setTimezone('Europe/Moscow')

    this.reportRepository.addConversionsIdentifiers(
      identifierMap,
      Object.keys(conversionTypes),
    )

    const qb = ReportQueryBuilder.create(this.db).setConversionTypes(
      Object.keys(conversionTypes),
    )

    this.processOrder(qb, args.sortField, args.sortOrder)
    this.processGroups(args.groups, qb)
    this.processMetrics(qb, identifierMap, args.metrics)
    qb.includeConversionFields(usedIdentifiers)

    // console.log(qb.sql())

    return qb.execute()
  }

  private processOrder(
    qb: ReportQueryBuilder,
    sortField?: string,
    sortOrder: Direction = Direction.asc,
  ): void {
    if (!sortField) {
      return
    }

    qb.orderBy(sortField, sortOrder)
  }

  private processGroups(groupKeys: string[], qb: ReportQueryBuilder): void {
    for (const groupKey of groupKeys) {
      if (!(groupKey in groups)) {
        throw new Error('Unknown group key ' + groupKey)
      }

      const { sql: query, include } = groups[groupKey]

      if (!query) {
        qb.select(groupKey)
        qb.groupByClickField(groupKey)
        continue
      }

      switch (include) {
        case 'affiliateNetwork':
          qb.selectAffiliateNetworkName()
          break
        case 'offer':
          qb.selectOfferName()
          break
        case 'stream':
          qb.selectStreamName()
          break
        case 'campaign':
          qb.selectCampaignName()
          break
        case 'source':
          qb.selectSourceName()
          break
        default:
          qb.selectRaw(query, groupKey)
          qb.groupBy(groupKey)
      }
    }
  }

  private processMetrics(
    qb: ReportQueryBuilder,
    identifierMap: IdentifierMap,
    metrics: string[],
  ): void {
    for (const metric of metrics) {
      const formulaObj = formulas[metric]
      const identifier = identifierMap[metric]

      if (formulaObj) {
        const { formula, decimals } = formulaObj
        let query = FormulaParser.create(
          formula,
          identifierMap,
          formulas,
        ).build()
        query = `CAST(${query} AS DECIMAL(12,${decimals ?? 0}))`
        qb.selectRaw(query, metric)
      } else if (identifier) {
        qb.selectRaw(identifier, metric)
      } else {
        throw new Error('Unknown metric: ' + metric)
      }
    }
  }

  private getIdentifierMapProxy(): {
    identifierMap: IdentifierMap
    usedIdentifiers: string[]
  } {
    const usedIdentifiers: string[] = []
    const identifierMap = new Proxy(this.reportRepository.getIdentifierMap(), {
      get(target, key: string): string {
        usedIdentifiers.push(key)

        return target[key]
      },
    })

    return { identifierMap, usedIdentifiers }
  }
}
