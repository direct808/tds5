import { FilterFieldTypeEnum, getFieldTypeData } from './get-field-type-data'
import { BadRequestException } from '@nestjs/common'

describe('getFieldTypeData', () => {
  const clickMetricMap = { cost: 'sum(click.cost)::numeric(12,2)' }

  it('returns formula when the field exists in formulas', () => {
    const res = getFieldTypeData('epc', clickMetricMap)

    expect(res).toEqual({
      type: FilterFieldTypeEnum.formula,
      formulaData: {
        decimals: 2,
        formula:
          '(revenue_sale + revenue_deposit + revenue_lead + revenue_registration) / clicks',
        summary: 'avg',
      },
    })
  })

  it('returns cost when the field exists in clickMetricMap', () => {
    const res = getFieldTypeData('cost', clickMetricMap)

    expect(res).toEqual({
      type: FilterFieldTypeEnum.clickMetric,
      clickMetric: 'sum(click.cost)::numeric(12,2)',
    })
  })

  it('returns group, when the field exists in groups', () => {
    const res = getFieldTypeData('year', clickMetricMap)

    expect(res).toEqual({
      type: FilterFieldTypeEnum.group,
      group: {
        sql: `date_part('year', click."createdAt" at time zone 'UTC' at time zone :timezone)`,
        type: 'number',
      },
    })
  })

  it('throws an error if the field is unknown', () => {
    expect(() => getFieldTypeData('unknownField', clickMetricMap)).toThrow(
      BadRequestException,
    )
  })
})
