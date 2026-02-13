import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import {
  DomainModel,
  DomainUncheckedCreateInput,
} from '@generated/prisma/models/Domain'
import {
  IDeleteMany,
  IGetEntitiesByIdsAndUserId,
  ISoftDeleteMany,
} from './utils/repository-utils'

@Injectable()
export class DomainRepository
  implements
    IGetEntitiesByIdsAndUserId<DomainModel>,
    IDeleteMany,
    ISoftDeleteMany
{
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: DomainUncheckedCreateInput): Promise<void> {
    await this.prisma.domain.create({ data })
  }

  public getListByUserId(userId: string): Promise<DomainModel[]> {
    return this.prisma.domain.findMany({ where: { userId } })
  }

  public getByIdsAndUserId: IGetEntitiesByIdsAndUserId<DomainModel>['getByIdsAndUserId'] =
    (args) => {
      return this.prisma.domain.findMany({
        where: { id: { in: args.ids }, userId: args.userId },
      })
    }

  public async update(id: string, data: Partial<DomainModel>): Promise<void> {
    await this.prisma.domain.update({ where: { id }, data })
  }

  public deleteMany: IDeleteMany['deleteMany'] = async (ids) => {
    await this.prisma.domain.deleteMany({
      where: { id: { in: ids } },
    })
  }

  public softDeleteMany: ISoftDeleteMany['softDeleteMany'] = async (ids) => {
    await this.prisma.domain.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    })
  }
}
