import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely, SelectQueryBuilder, sql } from 'kysely'
import { DB } from '@/shared/db'
import jsep from 'jsep'
import { conversionTypes } from '@/domain/conversion/types'

// export enum Metrics {
//   clicks = 'clicks',
//   uniqueClicksGlobal = 'unique_clicks_global',
//   uniqueClicksCampaign = 'unique_clicks_campaign',
//   cr = 'cr',
//   // cost = 'cost',
// }

const identifierMap: Record<string, string> = {
  clicks: 'count(*)::float',
  cost: 'sum(click.cost)::float',
}

const formulasMap: Record<string, string> = {
  conversions:
    'conversions_sale + conversions_lead + conversions_registration + deposits',
  deposits: 'conversions_deposit',
  cr: 'conversions / clicks * 100',
  cpa: 'cost / (conversions_lead + conversions_sale + conversions_rejected)',
  cpc: 'cost / clicks',
  cpl: 'cost / conversions_lead',
  cr_regs_to_deps: 'conversions_registration / conversions_deposit * 100 ',
  roi: '(conversions_lead + conversions_registration + conversions_sale+conversions_deposit - cost) / cost * 100',
}

export type GetReportArgs = {
  metrics: string[]
}

@Injectable()
export class ReportRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  public async getReport(args: GetReportArgs): Promise<any> {
    for (const [key] of Object.entries(conversionTypes)) {
      identifierMap[`conversions_${key}`] = `sum(c.conversions_${key})::int`
      identifierMap[`revenue_${key}`] = `sum(c.revenue_${key})::numeric(12,2)`
    }

    let qb = this.getBaseQuery()

    for (const metric of args.metrics) {
      const formula = formulasMap[metric]
      const identifier = identifierMap[metric]

      if (formula) {
        qb = this.applyFormula(qb, formula, metric)
      } else if (identifier) {
        qb = qb.select([sql.raw<number>(identifier).as(metric)])
      } else {
        throw new Error('Unknown metric: ' + metric)
      }

      // const ast = jsep(formula)
      // const sqll = astToSQL(ast)
      // qb = qb.select([sql.raw<number>(sqll).as(metric)])
    }

    // const asdf = qb.compile()

    // console.log(asdf.sql)

    const result = await qb.execute()

    return result
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
    formula: string,
    metric: string,
  ): any {
    const ast = jsep(formula)
    const sqll = astToSQL(ast)
    qb = qb.select([sql.raw<number>(sqll).as(metric)])

    return qb
  }
}

function astToSQL(node: jsep.Expression): string {
  switch (node.type) {
    case 'BinaryExpression':
      const right =
        node.operator === '/'
          ? // @ts-ignore
            `nullif(${astToSQL(node.right)}, 0)`
          : // @ts-ignore
            astToSQL(node.right)

      // @ts-ignore
      return `(${astToSQL(node.left)} ${node.operator} ${right})`
    case 'Identifier':
      // безопасно: экранируем имена колонок
      // @ts-ignore
      return replaceIdentifier(node.name)
    case 'Literal':
      // @ts-ignore
      return node.value.toString()
    default:
      throw new Error(`Unsupported node type: ${node.type}`)
  }
}

function replaceIdentifier(indefier: string): any {
  if (identifierMap[indefier]) {
    return identifierMap[indefier]
  }

  if (formulasMap[indefier]) {
    const ast = jsep(formulasMap[indefier])

    return astToSQL(ast)
  }

  throw new Error(`Unsupported identifier type: ${indefier}`)
  // switch (indefier) {
  //   case 'conversions':
  //     return 'count(c.count)::float'
  //   case 'clicks':
  //     return 'count(*)::float'
  //   default:
  //     return indefier
  // }
}
