import { BadRequestException, Injectable } from '@nestjs/common'
import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'
import { IdentifierMap } from '@/infra/repositories/report.repository'
import {
  FieldTypeFormula,
  FieldTypeIdentifier,
  FilterFieldTypeEnum,
  getFieldTypeData,
} from '@/domain/report/use-cases/get-report/utils/get-field-type-data'
import { FormulaParser } from '@/domain/report/use-cases/get-report/formula-parser'
import { formulas } from '@/domain/report/formulas'
import { FormulaSummaryEnum } from '@/domain/report/types'

@Injectable()
export class MetricProcessService {
  public process(
    qb: PostgresRawReportQueryBuilder,
    identifierMap: IdentifierMap,
    metrics: string[],
  ): void {
    for (const metric of metrics) {
      this.processItem(qb, identifierMap, metric)
    }
  }

  private processItem(
    qb: PostgresRawReportQueryBuilder,
    identifierMap: IdentifierMap,
    metric: string,
  ): void {
    const fieldTypeData = getFieldTypeData(metric, identifierMap)

    switch (fieldTypeData.type) {
      case FilterFieldTypeEnum.formula:
        return this.processItemFormula(qb, identifierMap, metric, fieldTypeData)
      case FilterFieldTypeEnum.identifier:
        return this.processItemIdentifier(qb, metric, fieldTypeData)
      case FilterFieldTypeEnum.group:
        throw new BadRequestException(`Unknown metric: '${metric}'`)
    }
  }

  private processItemFormula(
    qb: PostgresRawReportQueryBuilder,
    identifierMap: IdentifierMap,
    metric: string,
    fieldTypeData: FieldTypeFormula,
  ): void {
    const { formula, decimals, summary } = fieldTypeData.formulaData
    let query = FormulaParser.create(formula, identifierMap, formulas).build()
    query = `CAST(${query} AS DECIMAL(12,${decimals ?? 0}))`
    qb.selectMetric(query, metric, summary)
  }

  private processItemIdentifier(
    qb: PostgresRawReportQueryBuilder,
    metric: string,
    { identifier }: FieldTypeIdentifier,
  ): void {
    qb.selectMetric(identifier, metric, FormulaSummaryEnum.sum)
  }
}
