import { Injectable } from '@nestjs/common'
import {
  GetReportArgs,
  IdentifierMap,
  ReportRepository,
} from '@/infra/repositories/report.repository'
import { Kysely, SelectQueryBuilder, sql } from 'kysely'
import { DB } from '@/shared/db'
import { InjectKysely } from 'nestjs-kysely'
import { formulas } from '@/domain/report/formulas'
import { conversionTypes } from '@/domain/conversion/types'
import { Formula } from '@/domain/report/types'
import jsep from 'jsep'
import { groups } from './groups'
import { DataSource } from 'typeorm'

@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    @InjectKysely() private readonly db: Kysely<DB>,
    private readonly dataSource: DataSource,
  ) {}

  public async getReport(args: GetReportArgs): Promise<any> {
    const { usedIdentifiers, identifierMap } = this.getIdentifierMapProxy()

    await this.reportRepository.setTimezone('Europe/Moscow')

    this.reportRepository.addConversionsIdentifiers(
      identifierMap,
      Object.keys(conversionTypes),
    )

    let qb = this.db.selectFrom('click')

    for (const group of args.groups || []) {
      if (!(group in groups)) {
        throw new Error('Unknown group key ' + group)
      }
      // @ts-ignore
      const query = groups[group].sql

      if (query) {
        qb = qb.select(sql.raw<string>(query).as(group))
        qb = qb.groupBy(group as any)
      } else {
        qb = qb.select(group as any)
        qb = qb.groupBy(group as any)
      }
    }

    for (const metric of args.metrics) {
      const formula = formulas[metric]
      const identifier = identifierMap[metric]

      if (formula) {
        let query = this.formulaToSql(formula, identifierMap)
        query = `CAST(${query} AS DECIMAL(12,${formula.decimals ?? 0}))`
        qb = qb.select(sql.raw<number>(query).as(metric))
      } else if (identifier) {
        qb = qb.select(sql.raw<number>(identifier).as(metric))
      } else {
        throw new Error('Unknown metric: ' + metric)
      }
    }

    // console.log('usedIdentifiers', usedIdentifiers)

    const subquery = this.reportRepository.joinConversions(
      usedIdentifiers,
      Object.keys(conversionTypes),
    )
    if (subquery) {
      // @ts-ignore
      qb = qb.leftJoin(subquery.as('c'), 'c.clickId', 'click.id')
    }

    const asdf = qb.compile()
    console.log(asdf.sql)

    return qb.execute()
  }

  private formulaToSql(formula: Formula, identifierMap: IdentifierMap): string {
    const ast = jsep(formula.formula)

    return this.astToSQL(ast, identifierMap)
  }

  private getIdentifierMapProxy(): {
    identifierMap: IdentifierMap
    usedIdentifiers: string[]
  } {
    const usedIdentifiers: string[] = []
    const identifierMap = new Proxy(this.reportRepository.getIdentifierMap(), {
      get(target, key: string): string {
        usedIdentifiers.push(key)

        return target[key]
      },
    })

    return { identifierMap, usedIdentifiers }
  }

  private replaceIdentifier(
    identifier: string,
    identifierMap: IdentifierMap,
  ): any {
    if (identifierMap[identifier]) {
      return identifierMap[identifier]
    }

    if (formulas[identifier]) {
      const ast = jsep(formulas[identifier].formula)

      return this.astToSQL(ast, identifierMap)
    }

    throw new Error(`Unsupported identifier type: ${identifier}`)
  }

  private astToSQL(
    node: jsep.Expression,
    identifierMap: IdentifierMap,
  ): string {
    switch (node.type) {
      case 'BinaryExpression':
        const sqlRight = this.astToSQL(
          node.right as jsep.Expression,
          identifierMap,
        )
        const sqlLeft = this.astToSQL(
          node.left as jsep.Expression,
          identifierMap,
        )
        const right =
          node.operator === '/' ? `nullif(${sqlRight}, 0)` : sqlRight

        return `(${sqlLeft} ${node.operator} ${right})`
      case 'Identifier':
        return this.replaceIdentifier(node.name as string, identifierMap)
      case 'Literal':
        if (!node.value) {
          throw new Error('No value for literal')
        }

        return node.value.toString()
      default:
        throw new Error(`Unsupported node type: ${node.type}`)
    }
  }
}
