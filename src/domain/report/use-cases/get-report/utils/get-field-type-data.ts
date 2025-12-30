import { Group, groups } from '@/domain/report/groups'
import { Formula } from '@/domain/report/types'
import { formulas } from '@/domain/report/formulas'
import { BadRequestException } from '@nestjs/common'
import { ClickMetricMap } from '@/infra/repositories/report.repository'

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
  const formulaObj = formulas[field]
  const clickMetric = clickMetricMap[field]
  const group = groups[field]

  if (formulaObj) {
    return {
      type: FilterFieldTypeEnum.formula,
      formulaData: formulaObj,
    }
  } else if (clickMetric) {
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
    throw new BadRequestException(`Unknown field: '${field}'`)
  }
}
