import { DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from './user.entity'

@Injectable()
export class UserRepository {
  private readonly repository = this.dataSource.getRepository(User)

  constructor(private readonly dataSource: DataSource) {}

  public async getByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } })
  }
}
