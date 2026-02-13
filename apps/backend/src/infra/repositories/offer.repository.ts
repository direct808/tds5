import { Injectable } from '@nestjs/common'
import {
  IDeleteMany,
  IGetEntitiesByIdsAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from './utils/repository-utils'
import { PrismaService } from '../prisma/prisma.service'
import { OfferModel } from '@generated/prisma/models/Offer'

@Injectable()
export class OfferRepository
  implements
    IGetEntityByNameAndUserId<OfferModel>,
    IGetEntitiesByIdsAndUserId<OfferModel>,
    IDeleteMany
{
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    data: Pick<OfferModel, 'name' | 'userId' | 'url'>,
  ): Promise<void> {
    await this.prisma.offer.create({ data })
  }

  public getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<OfferModel | null> {
    return this.prisma.offer.findFirst({ where: { name, userId } })
  }

  public getListByUserId(userId: string): Promise<OfferModel[]> {
    return this.prisma.offer.findMany({ where: { userId } })
  }

  public async update(id: string, data: Partial<OfferModel>): Promise<void> {
    await this.prisma.offer.update({ where: { id }, data })
  }

  public deleteMany: IDeleteMany['deleteMany'] = async (ids) => {
    await this.prisma.offer.deleteMany({
      where: { id: { in: ids } },
    })
  }

  public getByIdsAndUserId: IGetEntitiesByIdsAndUserId<OfferModel>['getByIdsAndUserId'] =
    (args) => {
      return this.prisma.offer.findMany({
        where: { id: { in: args.ids }, userId: args.userId },
      })
    }

  public list(userId: string): Promise<OfferModel[]> {
    return this.prisma.offer.findMany({ where: { userId } })
  }
}
