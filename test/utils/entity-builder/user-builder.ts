import { DataSource } from 'typeorm'
import { User } from '@/domain/user/user.entity'

export class UserBuilder {
  private fields: Partial<User> = {}

  private constructor() {}

  static create() {
    return new this()
  }

  email(email: string) {
    this.fields.email = email

    return this
  }

  password(password: string) {
    this.fields.password = password

    return this
  }

  async save(ds: DataSource): Promise<User> {
    return ds.getRepository(User).save(this.fields)
  }
}
