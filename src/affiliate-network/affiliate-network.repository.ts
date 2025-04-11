import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { AffiliateNetwork } from './affiliate-network.entity'

@Injectable()
export class AffiliateNetworkRepository {
  private readonly repository = this.dataSource.getRepository(AffiliateNetwork)

  constructor(private readonly dataSource: DataSource) {}

  public async create(
    args: Pick<AffiliateNetwork, 'name' | 'params' | 'userId'>,
  ): Promise<void> {
    const source = this.repository.create(args)

    await this.repository.insert(source)
  }

  public async getByName(
    name: string,
    userId: string,
  ): Promise<AffiliateNetwork | null> {
    return this.repository.findOne({ where: { name, userId } })
  }

  public async getById(
    id: string,
    userId: string,
  ): Promise<AffiliateNetwork | null> {
    return this.repository.findOne({ where: { id, userId } })
  }

  public async getListByUserId(userId: string): Promise<AffiliateNetwork[]> {
    return this.repository.find({ where: { userId } })
  }

  public async update(
    id: string,
    data: Pick<AffiliateNetwork, 'name'>,
  ): Promise<void> {
    await this.repository.update({ id }, data)
  }

  public async delete(id: string): Promise<void> {
    await this.repository.softDelete(id)
  }

  async getByNameAndUserId(
    name: string,
    userId: string,
  ): Promise<AffiliateNetwork | null> {
    return this.repository.findOne({ where: { name, userId } })
  }
}
