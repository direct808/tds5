import { Injectable } from '@nestjs/common'
import { Click } from './click.entity'
import { DataSource } from 'typeorm'
import { IClick } from './click'
import { Kysely } from 'kysely'
import { InjectKysely } from 'nestjs-kysely'
import { DB } from '@/@types/db'

@Injectable()
export class ClickRepository {
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
}
