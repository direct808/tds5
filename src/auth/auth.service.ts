import { Injectable } from '@nestjs/common'
import { UserService } from '../user'
import { JwtService } from '@nestjs/jwt'
import { LoginUser } from './types'

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

  async sign(user: LoginUser) {
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
