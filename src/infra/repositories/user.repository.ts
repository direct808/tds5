import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { UserModel } from '@generated/prisma/models/User'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public getByEmail(email: string): Promise<UserModel | null> {
    return this.prisma.user.findFirst({ where: { email } })
  }
}
