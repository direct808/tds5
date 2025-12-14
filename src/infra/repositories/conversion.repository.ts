import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import {
  ConversionModel,
  ConversionUncheckedCreateInput,
  ConversionUncheckedUpdateInput,
} from '@generated/prisma/models/Conversion'

@Injectable()
export class ConversionRepository {
  constructor(private readonly prisma: PrismaService) {}

  public getList(): Promise<ConversionModel[]> {
    return this.prisma.conversion.findMany({ orderBy: { createdAt: 'desc' } })
  }

  public async create(data: ConversionUncheckedCreateInput): Promise<string> {
    const res = await this.prisma.conversion.create({ data })

    return res.id
  }

  public async getByClickIdAndTid(
    clickId: string,
    tid: string | undefined,
  ): Promise<ConversionModel | null> {
    const list = await this.prisma.conversion.findMany({
      where: { clickId, tid },
    })

    return list[0]
  }

  public getById(id: string): Promise<ConversionModel | null> {
    return this.prisma.conversion.findFirst({ where: { id } })
  }

  public async update(
    id: string,
    data: ConversionUncheckedUpdateInput,
  ): Promise<void> {
    await this.prisma.conversion.update({ where: { id }, data })
  }
}
