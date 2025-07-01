import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginUser } from './types'
import { UserService } from '@/user/user.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<LoginUser | null> {
    const user = await this.usersService.getByEmail(email)
    if (!user) {
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

  sign(user: LoginUser) {
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
