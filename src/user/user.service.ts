import { Injectable } from '@nestjs/common'
import { User } from './user.entity.js'
import { UserRepository } from './user.repository.js'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  public getByEmail(email: string): Promise<User | null> {
    return this.repository.getByEmail(email)
  }
}
