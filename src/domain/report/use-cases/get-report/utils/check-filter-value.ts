import {
  FILTER_TYPE_MAP,
  FilterOperatorEnum,
  FilterTypeEnum,
} from '@/domain/report/types'
import { BadRequestException } from '@nestjs/common'
import { isIPv4 } from 'node:net'

const needArrayOperators = [
  FilterOperatorEnum.in,
  FilterOperatorEnum.not_in,
  FilterOperatorEnum.between,
]

export function checkFilterValue(
  operator: FilterOperatorEnum,
  field: string,
  filterType: FilterTypeEnum,
  value: unknown,
): void {
  const jsType = getJsType(filterType)
  const valueNeedArray = needArrayOperators.includes(operator)

  if (valueNeedArray) {
    if (!Array.isArray(value)) {
      throw new BadRequestException(
        `Value type for field '${field}' must be a array`,
      )
    }

    checkValueForBetween(operator, value, field)

    for (const val of value) {
      checkValue(val, filterType, jsType, field)
      checkIpValue(filterType, value, field)
    }
  } else {
    checkValue(value, filterType, jsType, field)
    checkIpValue(filterType, value, field)
  }
}

function checkValueForBetween(
  operator: FilterOperatorEnum,
  value: unknown[],
  field: string,
): void {
  if (operator !== FilterOperatorEnum.between) {
    return
  }

  if (value.length !== 2) {
    throw new BadRequestException(`Must be two values for field '${field}'`)
  }

  if (value.some((val) => typeof val !== 'number')) {
    throw new BadRequestException(`Value for field '${field}' must be a number`)
  }

  const [val1, val2] = value as number[]
  if (val1 > val2) {
    throw new BadRequestException(
      `First value must be greater than the second value`,
    )
  }
}

function checkValue(
  value: unknown,
  filterType: FilterTypeEnum,
  jsType: string,
  field: string,
): void {
  if (typeof value !== jsType) {
    throw new BadRequestException(
      `Value for field '${field}' must be a ${filterType}`,
    )
  }
}

function checkIpValue(
  filterType: FilterTypeEnum,
  value: unknown,
  field: string,
): void {
  if (filterType === FilterTypeEnum.ip && !isIPv4(value as string)) {
    throw new BadRequestException(
      `Value for field '${field}' must be valid ip value`,
    )
  }
}

function getJsType(filterType: FilterTypeEnum): string {
  const jsType = FILTER_TYPE_MAP[filterType]

  if (!jsType) {
    throw new Error("Unknown filter type '${filterType}'")
  }

  return jsType
}
