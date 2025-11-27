import { Injectable } from '@nestjs/common'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from './utils/repository-utils'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { OfferModel } from '../../../generated/prisma/models/Offer'

@Injectable()
export class OfferRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
{
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    data: Pick<OfferModel, 'name' | 'userId' | 'url'>,
  ): Promise<void> {
    await this.prisma.offer.create({ data })
  }

  public async getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<OfferModel | null> {
    return this.prisma.offer.findFirst({ where: { name, userId } })
  }

  public async getListByUserId(userId: string): Promise<OfferModel[]> {
    return this.prisma.offer.findMany({ where: { userId } })
  }

  public async update(id: string, data: Partial<OfferModel>): Promise<void> {
    await this.prisma.offer.update({ where: { id }, data })
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.offer.delete({ where: { id } })
  }

  public async getByIdAndUserId(
    args: Pick<OfferModel, 'id' | 'userId'>,
  ): Promise<OfferModel | null> {
    return this.prisma.offer.findFirst({
      where: { id: args.id, userId: args.userId },
    })
  }

  public async getByIdsAndUserId(
    ids: string[],
    userId: string,
  ): Promise<OfferModel[]> {
    return this.prisma.offer.findMany({
      where: {
        id: { in: ids },
        userId,
      },
    })
  }
}
