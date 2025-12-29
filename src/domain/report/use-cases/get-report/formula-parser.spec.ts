import { FormulaParser } from './formula-parser'
import { BadRequestException } from '@nestjs/common'
import { FormulaRecord, FormulaSummaryEnum } from '@/domain/report/types'

describe('FormulaParser', () => {
  const identifierMap = {
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
      FormulaParser.create('****', identifierMap, allFormulas).build()

    expect(fn).toThrow(BadRequestException)
  })

  it('parse simple binary expression', () => {
    const parser = FormulaParser.create(
      '(a + -sumAB + 5) / 12',
      identifierMap,
      allFormulas,
    )

    expect(parser.build()).toBe(
      'coalesce((((table.a + - (table.a + table.b)) + 5) / nullif(12, 0)) , 0)',
    )
  })

  it('Unsupported node type', () => {
    const fn = () =>
      FormulaParser.create('asd(5)', identifierMap, allFormulas).build()

    expect(fn).toThrow(`Unsupported node type: CallExpression`)
  })

  it('Unsupported identifier type', () => {
    const fn = () =>
      FormulaParser.create('hz', identifierMap, allFormulas).build()

    expect(fn).toThrow('Unsupported identifier type: hz')
  })
})
