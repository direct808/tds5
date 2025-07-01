import { DataSource, In } from 'typeorm'
import { Injectable } from '@nestjs/common'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from '@/utils/repository-utils'
import { Offer } from './offer.entity'

@Injectable()
export class OfferRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
{
  private readonly repository = this.dataSource.getRepository(Offer)

  constructor(private readonly dataSource: DataSource) {}

  public async create(
    args: Pick<Offer, 'name' | 'userId' | 'url'>,
  ): Promise<void> {
    const source = this.repository.create(args)

    await this.repository.insert(source)
  }

  public async getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<Offer | null> {
    return this.repository.findOne({ where: { name, userId } })
  }

  public async getListByUserId(userId: string): Promise<Offer[]> {
    return this.repository.find({ where: { userId } })
  }

  public async update(id: string, data: Partial<Offer>): Promise<void> {
    await this.repository.update({ id }, data)
  }

  public async delete(id: string): Promise<void> {
    await this.repository.softDelete(id)
  }

  public async getByIdAndUserId(
    args: Pick<Offer, 'id' | 'userId'>,
  ): Promise<Offer | null> {
    return this.repository.findOne({
      where: { id: args.id, userId: args.userId },
    })
  }

  public async getByIdsAndUserId(
    ids: string[],
    userId: string,
  ): Promise<Offer[]> {
    return this.repository.findBy({
      id: In(ids),
      userId,
    })
  }
}
