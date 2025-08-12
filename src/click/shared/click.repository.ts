import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { ClickLimitProvider } from '@/stream-filter/filters/click-limit/click-limit-filter'
import { ClickUniqueProvider } from '@/stream-filter/filters/click-unique/click-unique-filter'
import { IClick } from '@/click/click'
import { Click } from '@/click/click.entity'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely, sql } from 'kysely'
import { DB } from '@/@types/db'

@Injectable()
export class ClickRepository
  implements ClickUniqueProvider, ClickLimitProvider
{
  private readonly repository = this.dataSource.getRepository(Click)

  constructor(
    private readonly dataSource: DataSource,
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  public async add(data: Partial<IClick>): Promise<void> {
    await this.repository.insert(data)
  }

  public getByCampaignId(campaignId: string): Promise<Click[]> {
    return this.repository.findBy({ campaignId })
  }

  public async getCountByVisitorId(visitorId: string): Promise<number> {
    const { count } = await this.db
      .selectFrom('click')
      .select(({ fn }) => [fn.count('click.id').as('count')])
      .where('visitorId', '=', visitorId)
      .executeTakeFirstOrThrow()

    return Number(count)
  }

  public async getCountByVisitorIdCampaignId(
    visitorId: string,
    campaignId: string,
  ): Promise<number> {
    const { count } = await this.db
      .selectFrom('click')
      .select(({ fn }) => [fn.count('click.id').as('count')])
      .where('visitorId', '=', visitorId)
      .where('campaignId', '=', campaignId)
      .executeTakeFirstOrThrow()

    return Number(count)
  }

  public async getCountByVisitorIdStreamId(
    visitorId: string,
    streamId: string,
  ): Promise<number> {
    const { count } = await this.db
      .selectFrom('click')
      .select(({ fn }) => [fn.countAll().as('count')])
      .where('visitorId', '=', visitorId)
      .where('streamId', '=', streamId)
      .executeTakeFirstOrThrow()

    return Number(count)
  }

  public async getCountPerHour(campaignId: string): Promise<number> {
    const { count } = await this.db
      .selectFrom('click')
      .select(({ fn }) => [fn.countAll().as('count')])
      .where('createdAt', '>=', sql<Date>`NOW() - interval '1 hour'`)
      .where('campaignId', '=', campaignId)
      .executeTakeFirstOrThrow()

    return Number(count)
  }

  public async getCountPerDay(campaignId: string): Promise<number> {
    const { count } = await this.db
      .selectFrom('click')
      .select(({ fn }) => [fn.countAll().as('count')])
      .where('createdAt', '>=', sql<Date>`NOW() - interval '1 day'`)
      .where('campaignId', '=', campaignId)
      .executeTakeFirstOrThrow()

    return Number(count)
  }

  public async getCountTotal(campaignId: string): Promise<number> {
    const { count } = await this.db
      .selectFrom('click')
      .select(({ fn }) => [fn.countAll().as('count')])
      .where('campaignId', '=', campaignId)
      .executeTakeFirstOrThrow()

    return Number(count)
  }
}
