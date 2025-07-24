import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { ClickUniqueProvider } from '@/stream-filter/filters/click-unique-filter'
import { ClickLimitProvider } from '@/stream-filter/filters/click-limit-filter'
import { IClick } from '@/click/click'
import { Click } from '@/click/click.entity'

@Injectable()
export class ClickRepository
  implements ClickUniqueProvider, ClickLimitProvider
{
  private readonly repository = this.dataSource.getRepository(Click)

  constructor(private readonly dataSource: DataSource) {}

  public async add(data: Partial<IClick>): Promise<void> {
    await this.repository.insert(data)
  }

  public getByCampaignId(campaignId: string): Promise<Click[]> {
    return this.repository.findBy({ campaignId })
  }

  getCountByVisitorId(visitorId: string): Promise<number> {
    throw new Error('Method not implemented ' + visitorId)
  }

  getCountByVisitorIdCampaignId(
    visitorId: string,
    campaignId: string,
  ): Promise<number> {
    throw new Error('Method not implemented' + visitorId + campaignId)
  }

  getCountByVisitorIdStreamId(
    visitorId: string,
    streamId: string,
  ): Promise<number> {
    throw new Error('Method not implemented' + visitorId + streamId)
  }

  getClickPerHour(campaignId: string): Promise<number> {
    throw new Error('Method not implemented ' + campaignId)
  }

  getClickPerDay(campaignId: string): Promise<number> {
    throw new Error('Method not implemented ' + campaignId)
  }

  getClickTotal(campaignId: string): Promise<number> {
    throw new Error('Method not implemented ' + campaignId)
  }
}
