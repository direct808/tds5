import { DataSource } from 'typeorm'
import { Source } from './source.entity'
import { Injectable } from '@nestjs/common'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from '../utils/repository-utils'

@Injectable()
export class SourceRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
{
  private readonly repository = this.dataSource.getRepository(Source)

  constructor(private readonly dataSource: DataSource) {}

  public async create(args: Pick<Source, 'name' | 'userId'>): Promise<void> {
    const source = this.repository.create(args)

    await this.repository.insert(source)
  }

  public async getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<Source | null> {
    return this.repository.findOne({ where: { name, userId } })
  }

  public async getListByUserId(userId: string): Promise<Source[]> {
    return this.repository.find({ where: { userId } })
  }

  public async update(id: string, data: Partial<Source>): Promise<void> {
    await this.repository.update({ id }, data)
  }

  public async delete(id: string): Promise<void> {
    await this.repository.softDelete(id)
  }

  public async getByIdAndUserId(
    args: Pick<Source, 'id' | 'userId'>,
  ): Promise<Source | null> {
    return this.repository.findOne({
      where: { id: args.id, userId: args.userId },
    })
  }
}
