import { BadRequestException, Injectable } from '@nestjs/common'
import { ReportQueryBuilder } from '@/domain/report/report-query-builder'
import { IdentifierMap } from '@/infra/repositories/report.repository'
import {
  FieldTypeFormula,
  FieldTypeIdentifier,
  FilterFieldTypeEnum,
  getFieldTypeData,
} from '@/domain/report/use-cases/get-report/utils/get-field-type-data'
import { FormulaParser } from '@/domain/report/formula-parser'
import { formulas } from '@/domain/report/formulas'

@Injectable()
export class MetricProcessService {
  public process(
    qb: ReportQueryBuilder,
    identifierMap: IdentifierMap,
    metrics: string[],
  ): void {
    for (const metric of metrics) {
      this.processItem(qb, identifierMap, metric)
    }
  }

  private processItem(
    qb: ReportQueryBuilder,
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
    qb: ReportQueryBuilder,
    identifierMap: IdentifierMap,
    metric: string,
    fieldTypeData: FieldTypeFormula,
  ): void {
    const { formula, decimals } = fieldTypeData.formulaData
    let query = FormulaParser.create(formula, identifierMap, formulas).build()
    query = `CAST(${query} AS DECIMAL(12,${decimals ?? 0}))`
    qb.selectRaw(query, metric)
  }

  private processItemIdentifier(
    qb: ReportQueryBuilder,
    metric: string,
    { identifier }: FieldTypeIdentifier,
  ): void {
    qb.selectRaw(identifier, metric)
  }
}
