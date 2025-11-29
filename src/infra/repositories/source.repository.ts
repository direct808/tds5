import { Injectable } from '@nestjs/common'
import {
  IGetEntityByIdAndUserId,
  IGetEntityByNameAndUserId,
  NameAndUserId,
} from './utils/repository-utils'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { SourceModel } from '../../../generated/prisma/models/Source'

@Injectable()
export class SourceRepository
  implements IGetEntityByNameAndUserId, IGetEntityByIdAndUserId
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

  public async delete(id: string): Promise<void> {
    await this.prisma.source.delete({ where: { id } })
  }

  public getByIdAndUserId(
    args: Pick<SourceModel, 'id' | 'userId'>,
  ): Promise<SourceModel | null> {
    return this.prisma.source.findFirst({
      where: { id: args.id, userId: args.userId },
    })
  }
}
