import { DataSource, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { User } from './user.entity.js'

@Injectable()
export class UserRepository {
  private readonly repository: Repository<User>

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User)
  }

  public async getByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } })
  }
}
