import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginUser } from './types'
import * as bcrypt from 'bcrypt'
import { UserRepository } from '@/infra/repositories/user.repository'
import { isNullable } from '@/shared/helpers'

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<LoginUser | null> {
    const user = await this.userRepository.getByEmail(email)
    if (isNullable(user)) {
      return null
    }
    const passwordEqual = await this.comparePassword(pass, user.password)
    if (!passwordEqual) {
      return null
    }
    const { password, ...result } = user

    return result
  }

  private comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  sign(user: LoginUser): { accessToken: string } {
    const payload = { email: user.email, sub: user.id }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
