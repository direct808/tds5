import { Injectable } from '@nestjs/common'
import { ClickLimitProvider } from '../../domain/click/stream/filter/filters/click-limit/click-limit-filter'
import { ClickUniqueProvider } from '../../domain/click/stream/filter/filters/click-unique/click-unique-filter'
import { InjectKysely } from 'nestjs-kysely'
import { Kysely, sql } from 'kysely'
import { DB } from '@generated/kysely'
import {
  ClickModel,
  ClickUncheckedCreateInput,
} from '@generated/prisma/models/Click'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ClickRepository
  implements ClickUniqueProvider, ClickLimitProvider
{
  constructor(
    private readonly prisma: PrismaService,
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  public async add(data: ClickUncheckedCreateInput): Promise<void> {
    await this.prisma.click.create({ data })
  }

  public getByCampaignId(campaignId: string): Promise<ClickModel[]> {
    return this.prisma.click.findMany({ where: { campaignId } })
  }

  public getById(id: string): Promise<ClickModel | null> {
    return this.prisma.click.findFirst({ where: { id } })
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
