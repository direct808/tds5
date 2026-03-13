import { FormulaParser } from './formula-parser'
import { BadRequestException } from '@nestjs/common'
import { FormulaRecord, FormulaSummaryEnum } from '@/domain/report/types'

describe('FormulaParser', () => {
  const clickMetricMap = {
    a: 'table.a',
    b: 'table.b',
  }

  const allFormulas: FormulaRecord = {
    sumAB: {
      formula: 'a + b',
      summary: FormulaSummaryEnum.sum,
    },
  }

  it('Syntax error', () => {
    const fn = () =>
      FormulaParser.create('****', clickMetricMap, allFormulas).build()

    expect(fn).toThrow(BadRequestException)
  })

  it('parse simple binary expression', () => {
    const parser = FormulaParser.create(
      '(a + -sumAB + 5) / 12',
      clickMetricMap,
      allFormulas,
    )

    expect(parser.build()).toBe(
      'coalesce((((table.a + - (table.a + table.b)) + 5) / nullif(12, 0)::decimal(12,2)), 0)',
    )
  })

  it('Unsupported node type', () => {
    const fn = () =>
      FormulaParser.create('asd(5)', clickMetricMap, allFormulas).build()

    expect(fn).toThrow(`Unsupported node type: CallExpression`)
  })

  it('Unsupported clickMetric type', () => {
    const fn = () =>
      FormulaParser.create('hz', clickMetricMap, allFormulas).build()

    expect(fn).toThrow('Unsupported clickMetric type: hz')
  })
})
