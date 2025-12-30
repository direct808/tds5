import { BadRequestException, Injectable } from '@nestjs/common'
import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'
import { ClickMetricMap } from '@/infra/repositories/report.repository'
import {
  FieldTypeFormula,
  FieldTypeClickMetric,
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
    clickMetricMap: ClickMetricMap,
    metrics: string[],
  ): void {
    for (const metric of metrics) {
      this.processItem(qb, clickMetricMap, metric)
    }
  }

  private processItem(
    qb: PostgresRawReportQueryBuilder,
    clickMetricMap: ClickMetricMap,
    metric: string,
  ): void {
    const fieldTypeData = getFieldTypeData(metric, clickMetricMap)

    switch (fieldTypeData.type) {
      case FilterFieldTypeEnum.formula:
        return this.processItemFormula(
          qb,
          clickMetricMap,
          metric,
          fieldTypeData,
        )
      case FilterFieldTypeEnum.clickMetric:
        return this.processItemclickMetric(qb, metric, fieldTypeData)
      case FilterFieldTypeEnum.group:
        throw new BadRequestException(`Unknown metric: '${metric}'`)
    }
  }

  private processItemFormula(
    qb: PostgresRawReportQueryBuilder,
    clickMetricMap: ClickMetricMap,
    metric: string,
    fieldTypeData: FieldTypeFormula,
  ): void {
    const { formula, decimals, summary } = fieldTypeData.formulaData
    let query = FormulaParser.create(formula, clickMetricMap, formulas).build()
    query = `cast(${query} as numeric(12,${decimals ?? 0}))`
    qb.selectMetric(query, metric, summary)
  }

  private processItemclickMetric(
    qb: PostgresRawReportQueryBuilder,
    metric: string,
    { clickMetric }: FieldTypeClickMetric,
  ): void {
    qb.selectMetric(clickMetric, metric, FormulaSummaryEnum.sum)
  }
}
