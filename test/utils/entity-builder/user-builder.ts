import { PrismaClient } from '../../../generated/prisma/client'
import {
  UserModel,
  UserUncheckedCreateInput,
} from '../../../generated/prisma/models/User'

export class UserBuilder {
  private fields: UserUncheckedCreateInput = {} as UserUncheckedCreateInput

  private constructor() {}

  static create(): UserBuilder {
    return new this()
  }

  email(email: string): UserBuilder {
    this.fields.email = email

    return this
  }

  password(password: string): UserBuilder {
    this.fields.password = password

    return this
  }

  save(prisma: PrismaClient): Promise<UserModel> {
    return prisma.user.create({ data: this.fields })
  }
}
