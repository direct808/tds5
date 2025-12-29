import { BadRequestException, Injectable } from '@nestjs/common'
import {
  FilterOperatorEnum,
  FilterOperators,
  FilterTypeEnum,
  InputFilterData,
} from '@/domain/report/types'
import { IdentifierMap } from '@/infra/repositories/report.repository'
import { formulas } from '@/domain/report/formulas'
import { FormulaParser } from '@/domain/report/use-cases/get-report/formula-parser'
import {
  FieldTypeFormula,
  FieldTypeGroup,
  FieldTypeIdentifier,
  FilterFieldTypeEnum,
  getFieldTypeData,
} from '@/domain/report/use-cases/get-report/utils/get-field-type-data'
import { checkFilterValue } from '@/domain/report/use-cases/get-report/utils/check-filter-value'
import { PostgresRawReportQueryBuilder } from '@/domain/report/use-cases/get-report/postgres-raw-report-query-builder'

@Injectable()
export class FilterProcessorService {
  public process(
    qb: PostgresRawReportQueryBuilder,
    identifierMap: IdentifierMap,
    filters: InputFilterData[],
  ): void {
    for (const inputFilterData of filters) {
      this.processItem(qb, identifierMap, inputFilterData)
    }
  }

  private processItem(
    qb: PostgresRawReportQueryBuilder,
    identifierMap: IdentifierMap,
    inputFilterData: InputFilterData,
  ): void {
    const [field] = inputFilterData
    const fieldTypeData = getFieldTypeData(field, identifierMap)

    switch (fieldTypeData.type) {
      case FilterFieldTypeEnum.formula:
        return this.processItemFormula(
          qb,
          identifierMap,
          fieldTypeData,
          inputFilterData,
        )

      case FilterFieldTypeEnum.identifier:
        return this.processItemIdentifier(qb, fieldTypeData, inputFilterData)

      case FilterFieldTypeEnum.group:
        return this.processItemGroup(qb, fieldTypeData, inputFilterData)
    }
  }

  private processItemFormula(
    qb: PostgresRawReportQueryBuilder,
    identifierMap: IdentifierMap,
    fieldTypeData: FieldTypeFormula,
    inputFilterData: InputFilterData,
  ): void {
    const [, operator, value] = inputFilterData
    const { formula } = fieldTypeData.formulaData
    let query = FormulaParser.create(formula, identifierMap, formulas).build()
    query = `${query}`
    this.checkFilterData(FilterTypeEnum.number, inputFilterData)
    qb.having(query, operator, value)
  }

  private processItemIdentifier(
    qb: PostgresRawReportQueryBuilder,
    { identifier }: FieldTypeIdentifier,
    inputFilterData: InputFilterData,
  ): void {
    const [, operator, value] = inputFilterData
    this.checkFilterData(FilterTypeEnum.number, inputFilterData)
    qb.having(identifier, operator, value)
  }

  private processItemGroup(
    qb: PostgresRawReportQueryBuilder,
    fieldTypeData: FieldTypeGroup,
    inputFilterData: InputFilterData,
  ): void {
    const [field, operator, value] = inputFilterData
    const { sql, type, disableFilter } = fieldTypeData.group
    if (disableFilter) {
      throw new BadRequestException(`Filter disable for field '${field}'`)
    }
    const q = sql ? sql : `"${field}"`
    this.checkFilterData(type, inputFilterData)
    qb.whereGroup(q, operator, value)
  }

  private checkFilterData(type: FilterTypeEnum, data: InputFilterData): void {
    const [field, operator, value] = data
    checkFilterValue(operator, field, type, value)
    this.checkOperator(operator, type)
  }

  private checkOperator(
    operator: FilterOperatorEnum,
    type: FilterTypeEnum,
  ): void {
    const op = FilterOperators[operator]

    if (!op) {
      throw new BadRequestException(`Unsupported operator '${operator}'`)
    }

    if (!op.types.includes(type)) {
      throw new BadRequestException(`Operator not support for type '${type}'`)
    }
  }
}
