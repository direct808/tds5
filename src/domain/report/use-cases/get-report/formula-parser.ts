import jsep from 'jsep'
import type { FormulaRecord } from '@/domain/report/types'
import { BadRequestException } from '@nestjs/common'

type IdentifierMap = Record<string, string>

export class FormulaParser {
  public static create(
    formula: string,
    identifierMap: IdentifierMap,
    allFormulas: FormulaRecord,
  ): FormulaParser {
    return new this(formula, identifierMap, allFormulas)
  }

  private constructor(
    private readonly formula: string,
    private readonly identifierMap: IdentifierMap,
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
      case 'Identifier':
        return this.replaceIdentifier(node as jsep.Identifier)
      case 'Literal':
        return this.processLiteral(node as jsep.Literal)
      default:
        throw new BadRequestException(`Unsupported node type: ${node.type}`)
    }
  }

  private processBinaryExpression(node: jsep.BinaryExpression): string {
    const sqlRight = this.astToSQL(node.right)
    const sqlLeft = this.astToSQL(node.left)
    const right = node.operator === '/' ? `nullif(${sqlRight}, 0)` : sqlRight

    return `(${sqlLeft} ${node.operator} ${right})`
  }

  private processLiteral(node: jsep.Literal): string {
    if (!node.value) {
      throw new Error('No value for literal')
    }

    return node.value.toString()
  }

  private replaceIdentifier({ name }: jsep.Identifier): string {
    if (this.identifierMap[name]) {
      return this.identifierMap[name]
    }

    if (this.allFormulas[name]) {
      const ast = jsep(this.allFormulas[name].formula)

      return this.astToSQL(ast)
    }

    throw new Error(`Unsupported identifier type: ${name}`)
  }
}
