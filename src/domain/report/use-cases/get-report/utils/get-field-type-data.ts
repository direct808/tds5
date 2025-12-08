import { Group, groups } from '@/domain/report/groups'
import { Formula } from '@/domain/report/types'
import { formulas } from '@/domain/report/formulas'
import { BadRequestException } from '@nestjs/common'
import { IdentifierMap } from '@/infra/repositories/report.repository'

export enum FilterFieldTypeEnum {
  formula,
  identifier,
  group,
}

export type FieldTypeFormula = {
  type: FilterFieldTypeEnum.formula
  formulaData: Formula
}

export type FieldTypeIdentifier = {
  type: FilterFieldTypeEnum.identifier
  identifier: string
}

export type FieldTypeGroup = {
  type: FilterFieldTypeEnum.group
  group: Group
}

type FieldType = FieldTypeFormula | FieldTypeIdentifier | FieldTypeGroup

export function getFieldTypeData(
  field: string,
  identifierMap: IdentifierMap,
): FieldType {
  const formulaObj = formulas[field]
  const identifier = identifierMap[field]
  const group = groups[field]

  if (formulaObj) {
    return {
      type: FilterFieldTypeEnum.formula,
      formulaData: formulaObj,
    }
  } else if (identifier) {
    return {
      type: FilterFieldTypeEnum.identifier,
      identifier,
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
