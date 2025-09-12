import { Injectable } from '@nestjs/common'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from '@/utils/repository-utils'
import { DataSource, EntityManager } from 'typeorm'
import { Campaign } from './entity/campaign.entity'
import { FullCampaign } from '@/campaign/types'

@Injectable()
export class CampaignRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
{
  private readonly repository = this.dataSource.getRepository(Campaign)

  constructor(private readonly dataSource: DataSource) {}

  public async getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<Campaign | null> {
    return this.repository.findOne({ where: { name, userId } })
  }

  public async create(
    manager: EntityManager,
    args: Partial<Campaign>,
  ): Promise<Campaign> {
    const campaign = manager.create(Campaign, args)

    return manager.save(campaign)
  }

  public async update(
    manager: EntityManager,
    id: string,
    args: Partial<Campaign>,
  ): Promise<void> {
    await manager.update(Campaign, id, args)
  }

  public async getByIdAndUserId(
    args: Pick<Campaign, 'id' | 'userId'>,
  ): Promise<Campaign | null> {
    return this.repository.findOne({
      where: { id: args.id, userId: args.userId },
    })
  }

  public async getFullByCode(code: string): Promise<FullCampaign | null> {
    return this.repository.findOne({
      where: { code, active: true },
      relations: [
        'streams',
        'streams.streamOffers',
        'streams.streamOffers.offer',
        'streams.streamOffers.offer.affiliateNetwork',
        'streams.actionCampaign',
      ],
    })
  }
}
