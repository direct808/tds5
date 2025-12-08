import {
  FilterFieldTypeEnum,
  getFieldTypeData,
} from '@/domain/report/use-cases/get-report/utils/get-field-type-data'
import { BadRequestException } from '@nestjs/common'

describe('getFieldTypeData', () => {
  const identifierMap = { cost: 'sum(click.cost)::numeric(12,2)' }

  it('returns formula when the field exists in formulas', () => {
    const res = getFieldTypeData('epc', identifierMap)

    expect(res).toEqual({
      type: FilterFieldTypeEnum.formula,
      formulaData: {
        decimals: 2,
        formula:
          '(revenue_sale + revenue_deposit + revenue_lead + revenue_registration) / clicks',
      },
    })
  })

  it('returns cost when the field exists in identifierMap', () => {
    const res = getFieldTypeData('cost', identifierMap)

    expect(res).toEqual({
      type: FilterFieldTypeEnum.identifier,
      identifier: 'sum(click.cost)::numeric(12,2)',
    })
  })

  it('returns group, when the field exists in groups', () => {
    const res = getFieldTypeData('year', identifierMap)

    expect(res).toEqual({
      type: FilterFieldTypeEnum.group,
      group: { sql: `date_part('year', click."createdAt")`, type: 'number' },
    })
  })

  it('throws an error if the field is unknown', () => {
    expect(() => getFieldTypeData('unknownField', identifierMap)).toThrow(
      BadRequestException,
    )
  })
})
