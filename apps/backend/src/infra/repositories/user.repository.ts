import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserModel } from '@generated/prisma/models/User'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  public getByLogin(login: string): Promise<UserModel | null> {
    return this.prisma.user.findFirst({ where: { login } })
  }

  public count(): Promise<number> {
    return this.prisma.user.count()
  }

  public async create(
    data: Pick<UserModel, 'login' | 'password'>,
  ): Promise<UserModel> {
    return this.prisma.user.create({ data })
  }
}
