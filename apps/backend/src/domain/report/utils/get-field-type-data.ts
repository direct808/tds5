import { Group, groups } from '@/domain/report/groups'
import { Formula } from '@/domain/report/types'
import { FormulaKey, FORMULAS } from '@/domain/report/formulas'
import { BadRequestException } from '@nestjs/common'
import { ClickMetricMap } from '@/infra/repositories/report.repository'
import { isNullable } from '@/shared/helpers'

export enum FilterFieldTypeEnum {
  formula,
  clickMetric,
  group,
}

export type FieldTypeFormula = {
  type: FilterFieldTypeEnum.formula
  formulaData: Formula
}

export type FieldTypeClickMetric = {
  type: FilterFieldTypeEnum.clickMetric
  clickMetric: string
}

export type FieldTypeGroup = {
  type: FilterFieldTypeEnum.group
  group: Group
}

type FieldType = FieldTypeFormula | FieldTypeClickMetric | FieldTypeGroup

export function getFieldTypeData(
  field: string,
  clickMetricMap: ClickMetricMap,
): FieldType {
  const formulaObj = FORMULAS[field as FormulaKey]
  const clickMetric = clickMetricMap[field]
  const group = groups[field]

  if (!isNullable(formulaObj)) {
    return {
      type: FilterFieldTypeEnum.formula,
      formulaData: formulaObj,
    }
  } else if (!isNullable(clickMetric)) {
    return {
      type: FilterFieldTypeEnum.clickMetric,
      clickMetric,
    }
  } else if (group) {
    return {
      type: FilterFieldTypeEnum.group,
      group,
    }
  } else {
    throw new BadRequestException(`Unknown field: '${field}`)
  }
}
