import jsep from 'jsep'
import type { FormulaRecord } from '@/domain/report/types'
import { BadRequestException } from '@nestjs/common'
import { ClickMetricMap } from '@/infra/repositories/report.repository'

type clickMetricMap = Record<string, string>

export class FormulaParser {
  public static create(
    formula: string,
    clickMetricMap: clickMetricMap,
    allFormulas: FormulaRecord,
  ): FormulaParser {
    return new this(formula, clickMetricMap, allFormulas)
  }

  private constructor(
    private readonly formula: string,
    private readonly clickMetricMap: ClickMetricMap,
    private readonly allFormulas: FormulaRecord,
  ) {}

  public build(): string {
    try {
      const ast = jsep(this.formula)

      return this.astToSQL(ast)
    } catch (e) {
      throw new BadRequestException(e)
    }
  }

  private astToSQL(node: jsep.Expression): string {
    switch (node.type) {
      case 'BinaryExpression':
        return this.processBinaryExpression(node as jsep.BinaryExpression)
      case 'UnaryExpression':
        return this.processUnaryExpression(node as jsep.UnaryExpression)
      case 'Identifier':
        return this.replaceClickMetric(node as jsep.Identifier)
      case 'Literal':
        return this.processLiteral(node as jsep.Literal)
      default:
        throw new BadRequestException(`Unsupported node type: ${node.type}`)
    }
  }

  private processBinaryExpression(node: jsep.BinaryExpression): string {
    const sqlRight = this.astToSQL(node.right)
    const sqlLeft = this.astToSQL(node.left)
    const right =
      node.operator === '/' ? `nullif(${sqlRight}, 0)::decimal(12,2)` : sqlRight

    return `(${sqlLeft} ${node.operator} ${right})`
  }

  private processUnaryExpression(node: jsep.UnaryExpression): string {
    const sql = this.astToSQL(node.argument)

    return `${node.operator} ${sql}`
  }

  private processLiteral(node: jsep.Literal): string {
    if (!node.value) {
      throw new Error('No value for literal')
    }

    return node.value.toString()
  }

  private replaceClickMetric({ name }: jsep.Identifier): string {
    if (this.clickMetricMap[name]) {
      return this.clickMetricMap[name]
    }

    if (this.allFormulas[name]) {
      const ast = jsep(this.allFormulas[name].formula)

      return this.astToSQL(ast)
    }

    throw new BadRequestException(`Unsupported clickMetric type: ${name}`)
  }
}
