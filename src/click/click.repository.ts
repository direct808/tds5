import { Injectable } from '@nestjs/common'
import { Click } from './click.entity.js'
import { DataSource, Repository } from 'typeorm'
import { IClick } from './click.js'


@Injectable()
export class ClickRepository {
  private readonly repository: Repository<Click>

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Click)
  }

  public async add(data: Partial<IClick>): Promise<void> {
    await this.repository.insert(data)
  }

  public getByCampaignId(campaignId: string): Promise<Click[]> {
    return this.repository.findBy({ campaignId })
  }
}
