import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { AffiliateNetwork } from './affiliate-network.entity.js'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from '@/utils/repository-utils.js'

@Injectable()
export class AffiliateNetworkRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
{
  private readonly repository:Repository<AffiliateNetwork>

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AffiliateNetwork)
  }

  public async create(
    args: Pick<AffiliateNetwork, 'name' | 'offerParams' | 'userId'>,
  ): Promise<string> {
    const source = this.repository.create(args)

    const res = await this.repository.insert(source)
    return res.identifiers[0].id
  }

  public async getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<AffiliateNetwork | null> {
    return this.repository.findOne({ where: { name, userId } })
  }

  public async getByIdAndUserId(
    args: Pick<AffiliateNetwork, 'id' | 'userId'>,
  ): Promise<AffiliateNetwork | null> {
    return this.repository.findOne({
      where: { id: args.id, userId: args.userId },
    })
  }

  public async getListByUserId(userId: string): Promise<AffiliateNetwork[]> {
    return this.repository.find({ where: { userId } })
  }

  public async update(
    id: string,
    data: Partial<AffiliateNetwork>,
  ): Promise<void> {
    await this.repository.update({ id }, data)
  }

  public async delete(id: string): Promise<void> {
    await this.repository.softDelete(id)
  }
}
