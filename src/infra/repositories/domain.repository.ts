import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import {
  DomainModel,
  DomainUncheckedCreateInput,
} from '@generated/prisma/models/Domain'
import { IGetEntityByIdAndUserId } from '@/infra/repositories/utils/repository-utils'

@Injectable()
export class DomainRepository implements IGetEntityByIdAndUserId<DomainModel> {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: DomainUncheckedCreateInput): Promise<void> {
    await this.prisma.domain.create({ data })
  }

  public getListByUserId(userId: string): Promise<DomainModel[]> {
    return this.prisma.domain.findMany({ where: { userId } })
  }

  public getByIdAndUserId(
    args: Pick<DomainModel, 'id' | 'userId'>,
  ): Promise<DomainModel | null> {
    return this.prisma.domain.findFirst({
      where: { id: args.id, userId: args.userId },
    })
  }

  public async update(id: string, data: Partial<DomainModel>): Promise<void> {
    await this.prisma.domain.update({ where: { id }, data })
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.domain.delete({ where: { id } })
  }
}
