import { Injectable } from '@nestjs/common'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from './utils/repository-utils'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { AffiliateNetworkModel } from '../../../generated/prisma/models/AffiliateNetwork'

@Injectable()
export class AffiliateNetworkRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
{
  // private readonly repository = this.dataSource.getRepository(AffiliateNetwork)

  constructor(
    // private readonly dataSource: DataSource,
    private prisma: PrismaService,
  ) {}

  public async create(
    args: Pick<AffiliateNetworkModel, 'name' | 'offerParams' | 'userId'>,
  ): Promise<string> {
    const res = await this.prisma.affiliateNetwork.create({
      data: args,
    })

    return res.id
  }

  public async getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<AffiliateNetworkModel | null> {
    return this.prisma.affiliateNetwork.findFirst({
      where: { name, userId },
    })
  }

  public async getByIdAndUserId(
    args: Pick<AffiliateNetworkModel, 'id' | 'userId'>,
  ): Promise<AffiliateNetworkModel | null> {
    return this.prisma.affiliateNetwork.findFirst({
      where: { id: args.id, userId: args.userId },
    })
  }

  public async getListByUserId(
    userId: string,
  ): Promise<AffiliateNetworkModel[]> {
    return this.prisma.affiliateNetwork.findMany({ where: { userId } })
  }

  public async update(
    id: string,
    data: Partial<AffiliateNetworkModel>,
  ): Promise<void> {
    await this.prisma.affiliateNetwork.update({ data, where: { id } })
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.affiliateNetwork.delete({ where: { id } })
  }
}
