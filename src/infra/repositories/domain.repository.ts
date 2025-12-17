import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { DomainUncheckedCreateInput } from '@generated/prisma/models/Domain'

@Injectable()
export class DomainRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async create(data: DomainUncheckedCreateInput): Promise<void> {
    await this.prisma.domain.create({ data })
  }
}
