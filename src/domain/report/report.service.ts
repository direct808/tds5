import { Injectable } from '@nestjs/common'
import {
  GetReportArgs,
  IdentifierMap,
  ReportRepository,
} from '@/infra/repositories/report.repository'
import { Kysely } from 'kysely'
import { DB } from '@/shared/db'
import { InjectKysely } from 'nestjs-kysely'
import { formulas } from '@/domain/report/formulas'
import { conversionTypes } from '@/domain/conversion/types'
import { groups } from './groups'
import { ReportQueryBuilder } from '@/domain/report/report-query-builder'
import { FormulaBuilder } from '@/domain/report/formula-builder'

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  public async getReport(args: GetReportArgs): Promise<any> {
    const { usedIdentifiers, identifierMap } = this.getIdentifierMapProxy()

    await this.reportRepository.setTimezone('Europe/Moscow')

    this.reportRepository.addConversionsIdentifiers(
      identifierMap,
      Object.keys(conversionTypes),
    )

    const qb = ReportQueryBuilder.create(this.db).setConversionTypes(
      Object.keys(conversionTypes),
    )

    for (const group of args.groups || []) {
      if (!(group in groups)) {
        throw new Error('Unknown group key ' + group)
      }
      const query = groups[group].sql

      if (query) {
        qb.selectRaw(query, group)
      } else {
        qb.select(group)
      }
      qb.groupBy(group)
    }

    for (const metric of args.metrics) {
      this.processMetric(qb, identifierMap, metric)
    }

    qb.includeConversionFields(usedIdentifiers)

    // console.log(qb.sql())

    return qb.execute()
  }

  private processMetric(
    qb: ReportQueryBuilder,
    identifierMap: IdentifierMap,
    metric: string,
  ): void {
    const formula = formulas[metric]
    const identifier = identifierMap[metric]

    if (formula) {
      let query = FormulaBuilder.create(
        formula.formula,
        identifierMap,
        formulas,
      ).build()
      query = `CAST(${query} AS DECIMAL(12,${formula.decimals ?? 0}))`
      qb.selectRaw(query, metric)
    } else if (identifier) {
      qb.selectRaw(identifier, metric)
    } else {
      throw new Error('Unknown metric: ' + metric)
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
