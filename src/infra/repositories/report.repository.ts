import { Injectable } from '@nestjs/common'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely, SelectQueryBuilder, sql } from 'kysely'
import { DB } from '@/shared/db'
import jsep from 'jsep'
import { conversionTypes } from '@/domain/conversion/types'
import { formulas } from '@/domain/report/formulas'
import { Formula } from '@/domain/report/types'

const identifierMap: Record<string, string> = {
  clicks: 'count(*)::numeric(12,0)',
  cost: 'sum(click.cost)::numeric(12,2)',
  clicks_unique_global: 'count(distinct "visitorId")::numeric(12,0)',
  clicks_unique_campaign:
    'count(distinct("visitorId", "campaignId"))::numeric(12,0)',
  clicks_unique_stream:
    'count(distinct("visitorId", "streamId"))::numeric(12,0)',
  bots: 'count(*) FILTER (WHERE "isBot")::numeric(12,0)',
  proxies: 'count(*) FILTER (WHERE "isProxy")::numeric(12,0)',
  empty_referer: 'count(*) FILTER (WHERE "referer" IS NULL)::numeric(12,0)',
}

export type GetReportArgs = {
  metrics: string[]
}

@Injectable()
export class ReportRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  public getReport(args: GetReportArgs): Promise<any> {
    for (const [key] of Object.entries(conversionTypes)) {
      identifierMap[`conversions_${key}`] =
        `sum(c.conversions_${key})::numeric(12,0)`
      identifierMap[`revenue_${key}`] = `sum(c.revenue_${key})::numeric(12,2)`
    }

    let qb = this.getBaseQuery()

    for (const metric of args.metrics) {
      const formula = formulas[metric]
      const identifier = identifierMap[metric]

      if (formula) {
        qb = this.applyFormula(qb, formula, metric)
      } else if (identifier) {
        qb = qb.select([sql.raw<number>(identifier).as(metric)])
      } else {
        throw new Error('Unknown metric: ' + metric)
      }
    }

    // const asdf = qb.compile()
    // console.log(asdf.sql)

    return qb.execute()
  }

  private getBaseQuery(): any {
    let subquery = this.db
      .selectFrom('conversion')
      .select(({ fn }) => [fn.countAll().as('count'), 'clickId'])
      .groupBy('clickId')

    for (const [key] of Object.entries(conversionTypes)) {
      subquery = subquery.select(({ fn }) => [
        fn
          .countAll()
          .filterWhere('status', '=', key)
          .as('conversions_' + key),

        // sql<number>`sum(revenue) filter (where status = '${key}')::numeric(12,2)`.as(
        //   'revenue_' + key,
        // ),

        sql<number>`${fn.sum('revenue').filterWhere('status', '=', key)}::numeric(12,2)`.as(
          'revenue_' + key,
        ),

        // fn
        //   .sum('revenue')
        //   .filterWhere('status', '=', key)
        //   .as('revenue_' + key),
      ])
    }

    const qb = this.db
      .selectFrom('click')
      .leftJoin(subquery.as('c'), 'c.clickId', 'click.id')

    return qb
  }

  private applyFormula(
    qb: SelectQueryBuilder<any, any, any>,
    formula: Formula,
    metric: string,
  ): any {
    const ast = jsep(formula.formula)
    const decimals = formula.decimals ?? 0
    const query = `${astToSQL(ast)}::numeric(12,${decimals})`
    qb = qb.select([sql.raw<number>(query).as(metric)])

    return qb
  }
}

function astToSQL(node: jsep.Expression): string {
  switch (node.type) {
    case 'BinaryExpression':
      const right =
        node.operator === '/'
          ? `nullif(${astToSQL(node.right as jsep.Expression)}, 0)`
          : astToSQL(node.right as jsep.Expression)

      return `(${astToSQL(node.left as jsep.Expression)} ${node.operator} ${right})`
    case 'Identifier':
      return replaceIdentifier(node.name as string)
    case 'Literal':
      if (!node.value) {
        throw new Error('No value for literal')
      }

      return node.value.toString()
    default:
      throw new Error(`Unsupported node type: ${node.type}`)
  }
}

function replaceIdentifier(identifier: string): any {
  if (identifierMap[identifier]) {
    return identifierMap[identifier]
  }

  if (formulas[identifier]) {
    const ast = jsep(formulas[identifier].formula)

    return astToSQL(ast)
  }

  throw new Error(`Unsupported identifier type: ${identifier}`)
}
