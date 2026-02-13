import { Injectable } from '@nestjs/common'
import {
  IDeleteMany,
  IGetEntitiesByIdsAndUserId,
  IGetEntityByNameAndUserId,
  ISoftDeleteMany,
  NameAndUserId,
} from './utils/repository-utils'
import { PrismaService } from '../prisma/prisma.service'
import { SourceModel } from '@generated/prisma/models/Source'

@Injectable()
export class SourceRepository
  implements
    IGetEntityByNameAndUserId<SourceModel>,
    IGetEntitiesByIdsAndUserId<SourceModel>,
    IDeleteMany,
    ISoftDeleteMany
{
  constructor(private readonly prisma: PrismaService) {}

  public async create(
    data: Pick<SourceModel, 'name' | 'userId'>,
  ): Promise<void> {
    await this.prisma.source.create({ data })
  }

  public getByNameAndUserId({
    name,
    userId,
  }: NameAndUserId): Promise<SourceModel | null> {
    return this.prisma.source.findFirst({ where: { name, userId } })
  }

  public getListByUserId(userId: string): Promise<SourceModel[]> {
    return this.prisma.source.findMany({ where: { userId } })
  }

  public async update(id: string, data: Partial<SourceModel>): Promise<void> {
    await this.prisma.source.update({ where: { id }, data })
  }

  public deleteMany: IDeleteMany['deleteMany'] = async (ids) => {
    await this.prisma.source.deleteMany({
      where: { id: { in: ids } },
    })
  }

  public getByIdsAndUserId: IGetEntitiesByIdsAndUserId<SourceModel>['getByIdsAndUserId'] =
    (args) => {
      return this.prisma.source.findMany({
        where: { id: { in: args.ids }, userId: args.userId },
      })
    }

  public list(userId: string): Promise<SourceModel[]> {
    return this.prisma.source.findMany({ where: { userId } })
  }

  public softDeleteMany: ISoftDeleteMany['softDeleteMany'] = async (ids) => {
    await this.prisma.source.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    })
  }
}
