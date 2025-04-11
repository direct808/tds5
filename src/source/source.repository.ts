import { DataSource } from 'typeorm'
import { Source } from './source.entity'
import { Injectable } from '@nestjs/common'
import { AffiliateNetwork } from '../affiliate-network/affiliate-network.entity'

@Injectable()
export class SourceRepository {
  private readonly repository = this.dataSource.getRepository(Source)

  constructor(private readonly dataSource: DataSource) {}

  public async create(args: Pick<Source, 'name' | 'userId'>): Promise<void> {
    const source = this.repository.create(args)

    await this.repository.insert(source)
  }

  public async getByName(name: string, userId: string): Promise<Source | null> {
    return this.repository.findOne({ where: { name, userId } })
  }

  public async getById(id: string, userId: string): Promise<Source | null> {
    return this.repository.findOne({ where: { id, userId } })
  }

  public async getListByUserId(userId: string): Promise<Source[]> {
    return this.repository.find({ where: { userId } })
  }

  public async update(id: string, data: Pick<Source, 'name'>): Promise<void> {
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
