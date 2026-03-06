import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserModel } from '@generated/prisma/models/User'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public getByLogin(login: string): Promise<UserModel | null> {
    return this.prisma.user.findFirst({ where: { login } })
  }
}
