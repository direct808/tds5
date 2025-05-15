import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginUser } from './types'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<LoginUser | null> {
    const user = await this.usersService.getByEmail(email)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  sign(user: LoginUser) {
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
