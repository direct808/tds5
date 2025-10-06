import { Injectable } from '@nestjs/common'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely, SelectQueryBuilder, sql } from 'kysely'
import { DB } from '@/shared/db'
import jsep from 'jsep'
import { conversionTypes } from '@/domain/conversion/types'

const identifierMap: Record<string, string> = {
  clicks: 'count(*)',
  cost: 'sum(click.cost)',
  clicks_unique_global: 'count(distinct "visitorId")',
  clicks_unique_campaign: 'count(distinct("visitorId", "campaignId"))',
  clicks_unique_stream: 'count(distinct("visitorId", "streamId"))',
}

const formulasMap: Record<string, string> = {
  revenue:
    'revenue_sale + revenue_deposit + revenue_lead + revenue_registration',
  conversions:
    'conversions_sale + conversions_lead + conversions_registration + deposits',
  deposits: 'conversions_deposit',
  cr: 'conversions / clicks * 100',
  cpa: 'cost / (conversions_lead + conversions_sale + conversions_rejected)',
  cpc: 'cost / clicks',
  cpl: 'cost / conversions_lead',
  cr_regs_to_deps: 'conversions_registration / conversions_deposit * 100 ',
  roi: '(revenue - cost) / cost * 100',
  roi_confirmed: '((revenue_sale + revenue_deposit) - cost) / cost * 100',
  profit_loss: 'revenue / cost',
  profit_loss_confirmed: '(revenue_sale + revenue_deposit) / cost',
  clicks_unique_global_pct: 'clicks / clicks_unique_global * 100',
  clicks_unique_campaign_pct: 'clicks / clicks_unique_campaign * 100',
  clicks_unique_stream_pct: 'clicks / clicks_unique_stream * 100',
}

export type GetReportArgs = {
  metrics: string[]
}

@Injectable()
export class ReportRepository {
  constructor(@InjectKysely() private readonly db: Kysely<DB>) {}

  public getReport(args: GetReportArgs): Promise<any> {
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

function replaceIdentifier(identifier: string): any {
  if (identifierMap[identifier]) {
    return identifierMap[identifier]
  }

  if (formulasMap[identifier]) {
    const ast = jsep(formulasMap[identifier])

    return astToSQL(ast)
  }

  throw new Error(`Unsupported identifier type: ${identifier}`)
}
