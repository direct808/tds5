import { FormulaParser } from './formula-parser'
import { BadRequestException } from '@nestjs/common'

describe('FormulaParser', () => {
  const identifierMap = {
    a: 'table.a',
    b: 'table.b',
  }

  const allFormulas = {
    sumAB: {
      formula: 'a + b',
    },
  }

  it('Syntax error', () => {
    const fn = () =>
      FormulaParser.create('****', identifierMap, allFormulas).build()

    expect(fn).toThrow(BadRequestException)
  })

  it('parses simple binary expression', () => {
    const parser = FormulaParser.create(
      '(a + -sumAB + 5) / 12',
      identifierMap,
      allFormulas,
    )

    expect(parser.build()).toBe(
      '(((table.a + - (table.a + table.b)) + 5) / nullif(12, 0))',
    )
  })

  it('Unsupported node type', () => {
    const fn = () =>
      FormulaParser.create('asd(5)', identifierMap, allFormulas).build()

    expect(fn).toThrow(BadRequestException)
  })

  it('Unsupported identifier type', () => {
    const fn = () =>
      FormulaParser.create('hz', identifierMap, allFormulas).build()

    expect(fn).toThrow(BadRequestException)
  })
})
