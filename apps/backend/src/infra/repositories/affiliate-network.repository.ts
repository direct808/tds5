import { Injectable } from '@nestjs/common'
import {
  IDeleteMany,
  IGetEntitiesByIdsAndUserId,
  IGetEntityByNameAndUserId,
  ISoftDeleteMany,
  NameAndUserId,
} from './utils/repository-utils'
import { PrismaService } from '../prisma/prisma.service'
import { AffiliateNetworkModel } from '@generated/prisma/models/AffiliateNetwork'

@Injectable()
export class AffiliateNetworkRepository
  implements
    IGetEntityByNameAndUserId<AffiliateNetworkModel>,
    IGetEntitiesByIdsAndUserId<AffiliateNetworkModel>,
    IDeleteMany,
    ISoftDeleteMany
{
  constructor(private prisma: PrismaService) {}

  public async create(
    args: Pick<AffiliateNetworkModel, 'name' | 'offerParams' | 'userId'>,
  ): Promise<string> {
    const res = await this.prisma.affiliateNetwork.create({
      data: args,
    })

    return res.id
  }

  public getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<AffiliateNetworkModel | null> {
    return this.prisma.affiliateNetwork.findFirst({
      where: { name, userId },
    })
  }

  public getByIdsAndUserId: IGetEntitiesByIdsAndUserId<AffiliateNetworkModel>['getByIdsAndUserId'] =
    (args) => {
      return this.prisma.affiliateNetwork.findMany({
        where: { id: { in: args.ids }, userId: args.userId },
      })
    }

  public getListByUserId(userId: string): Promise<AffiliateNetworkModel[]> {
    return this.prisma.affiliateNetwork.findMany({ where: { userId } })
  }

  public async update(
    id: string,
    data: Partial<AffiliateNetworkModel>,
  ): Promise<void> {
    await this.prisma.affiliateNetwork.update({ data, where: { id } })
  }

  public deleteMany: IDeleteMany['deleteMany'] = async (ids) => {
    await this.prisma.affiliateNetwork.deleteMany({
      where: { id: { in: ids } },
    })
  }

  public softDeleteMany: ISoftDeleteMany['softDeleteMany'] = async (ids) => {
    await this.prisma.affiliateNetwork.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    })
  }

  public list(userId: string): Promise<AffiliateNetworkModel[]> {
    return this.prisma.affiliateNetwork.findMany({
      where: { userId, deletedAt: null },
    })
  }
}
