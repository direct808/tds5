import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely, sql } from 'kysely'
import { DB } from '@/shared/db'

export enum Metrics {
  clicks = 'clicks',
  uniqueClicksGlobal = 'unique_clicks_global',
  uniqueClicksCampaign = 'unique_clicks_campaign',
  // cost = 'cost',
}

type GetReportArgs = {
  metrics: Metrics[]
}

@Injectable()
export class ReportRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  public async getReport(args: GetReportArgs): Promise<any> {
    const subquery = this.db
      .selectFrom('conversion')
      .select([sql`count(*)`.as('count'), 'clickId'])
      .select('cost')
      .groupBy('clickId')

    let qb = this.db
      .selectFrom('click')
      .leftJoin(subquery.as('c'), 'c.clickId', 'click.id')
      // .selectAll('click')
      .select([sql`1`.as('one')])

    for (const metric of args.metrics) {
      switch (metric) {
        case Metrics.clicks:
          qb = qb.select(({ fn }) => [fn.count('id').as('clicks')])
          break

        case Metrics.uniqueClicksGlobal:
          qb = qb.select(({ fn }) => [
            fn.count('visitorId').distinct().as('visitors'),
          ])
          break

        case Metrics.uniqueClicksCampaign:
          qb = qb.select([
            sql`count(distinct ("visitorId", "campaignId"))`.as(
              'unique_clicks_campaign',
            ),
          ])
          break

        default:
          const m: never = metric
          throw new Error('Unknown metric' + m)
      }
    }

    const result = await qb.execute()

    console.log(result)
  }
}
